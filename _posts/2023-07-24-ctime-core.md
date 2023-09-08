---
title: Compile-time language core
date: 2023-07-24 18:00:00 +0300
author: Andrew Belyaev
---

Today's post covers the part of Bondrewd's design I consider possibly the most
important, and the one I'm currently stuck on. But before I get to it, I'd
like to briefly introduce the idea of Bondrewd's compile-time execution.

You may already be familiar with `constexpr` and `consteval` in modern C++.
There, it server to mark functions and variables that can, and sometimes must,
be evaluated at compile time. This is useful, but its power and generality are
limited. Only a limited subset of C++ can be utilized in `constexpr` contexts,
essentially resulting in a pure functional sub-language. Moreover, a lot of
what feels like it should be possible to do with compile-time code is not, and
has to instead be done via other methods, like template metaprogramming,
compiler built-ins or even text-based preprocessing. The idea at the core of
Bondrewd is that compile-time execution comes first. As I've mentioned in
previous posts, I've dubbed this idea {{ site.shukufuku_translation }}.
Essentially, the program is treated not as a description of runtime code, but
as a compile-time script that results in the compilation of a runtime
executable. This way, compile-time code acts not as a limited feature overlaid
on top of an inflexible out-of-scope compiler, but as the foundation of the
compiler, which becomes little more than a compile-time library at this point.

As I have mentioned in my [post]({% post_url 2023-07-17-lang-principles %}) on
the principles of Bondrewd's design, I value uniformity and regularity, so it
would make sense to have compile-time and runtime code be specified using the
same language. Generally, that is my indeed intention, however I have come to
the conclusion that some semantic differences are necessary. This primarily
concerns the value semantics: whereas for runtime Bondrewd, I envision uniquely
owned values (with a move-by-default approach, similar to Rust), for
compile-time Bondrewd, I believe shared reference-counted objects make
significantly more sense. Compile-time execution will utilize reference
counting under the hood regardless, so it is reasonable to reflect that in
the value semantics. While this might seem far-fetched, consider that,
as part of the language uniformity, types will be handled as regular
compile-time values. If the default semantics were pass-by-value, then the
statement `let a: uint4 = 1` would at best copy, and at worst move from the
global `uint4`. (You might suggest making all types trivially copyable, but
that would encounter other issues[^why-not-copy-types]). The workaround would
be to explicitly specify passing by reference, however, doing so for types
would be extremely confusing (`let a: &uint4 = 1`). And introducing a hack
specifically for type annotations doesn't solve this either, because types are
used in other contexts as well (for instance, templates), where they can't be
handled by any different rules than other expressions. The root of the problem
is, the user intuitively expects types to be shared by default, and my
extrapolation claims that the same is actually true for all compile-time
objects. Combine that with the fact that such semantics would result in the
best performance due to the most direct mapping to the underlying
implementation, and I believe it is reasonable to accept this approach.
While I'm on this sidetrack, I'll mention another inevitable semantic
difference: forward references. While for runtime code these could be
automatically resolved at compile-time, for compile-time code this would be
computationally inefficient, confusing and often impossible. My solution is
to adopt Python's approach of only requiring a suitable definition to be
available when it's actually needed. This approach is both simple and
intuitive, but suboptimal for performance-oriented runtime code.

[^why-not-copy-types]:
    Copying types seems to work at first glance, but demanding all types be
    trivially copyable has its issues. The most critical implication would be
    that types cannot have proper attributes, because those would be tied to a
    specific copy, rather than the type itself. So, defining something like
    `uint4::MAX` would only affect the following usages of the type, but not
    the already processed ones. Before you try to object that types should be
    immutable (at compile-time), consider that this would forbid all `impl`
    blocks, both for traits and for proper types.

Now that I've outlined the general idea of Bondrewd's compile-time part (which
I will, by the way, abbreviate as `ctime` every now and then), I can get to the
beating heart of it, without which it cannot exist. I'm talking about the core
part of this interpreted sublanguage, which, if viewed from inside the language,
would appear to be self-referential (i.e. implemented in terms of itself). This
isn't unique to `ctime` Bondrewd. For example, Python's `object` and `type` are
parts of the language core, implemented in C, but appearing from within to be
instances of themselves. This isn't the only possible way to expose the
foundation of a metaprogramming-friendly language to the user, but by far the
best in my opinion. Unlike the alternatives, this completely hides the special
cases from the user, providing superior uniformity and regularity.

However, with this approach it is important to get this language core exactly
right, because it will be the foundation of the entire language. This is why
it's the part I'm currently stuck on. I can't directly copy Python's approach,
because our interpretations of OOP differ: instead of traditional inheritance,
I chose to go with Rust-like traits. (I disagree with a lot of critique towards
OOP, but I do agree that inheritance as the primary way of code reuse does
indeed lie at the root of many issues). Where Python's `type` is a type (an
object of type `type`), in my case it's a trait (an object, for whose type the
trait `Trait` is implemented). _(Yes, `Trait` is a trait too)_. This results in
a less straightforward implementation, but I believe the benefits are worth it.
For example, something that is impossible in Python, is that the type of a
tuple is a tuple of types: `let a: (uint4, ref[str]) = (1, "hello")`. Note that
while some other languages, like Rust, also denote tuple types this way, there
it's enabled by having special grammar rules for types, whereas in Bondrewd
this is an expression like any other. This also comes with a nice side effect,
which other languages often have to model via special case semantics: the unit
type (a type inhabited by a single value, used in place of C's `void`, but more
general) is usually represented as a named entity (`Unit`, `None`), or as an
empty tuple (because it already has the desired properties). In both cases,
languages tend to allow special syntax for it, so that the value of the unit
type can be specified exactly the same way as the type name. In Bondrewd, this
is just a consequence of the representation of tuple types: unit, represented
by the empty tuple, is the type of itself.

Here are some of the core parts on the language and my ideas about them:
- **Object**. It's not actually represented inside the language directly,
  because it makes little sense without inheritance, but it's what any
  `ctime` value is.
- **`Type`**. It's a trait that enables the use of an object as a type. Note that
  due to the way traits work (which I will undoubtedly cover later), to affect
  an object, a trait has to be implemented on its type, not itself. This means
  that for `uint4` to be a type, `Type` has to be implemented for `uint4`'s
  type. And for its type. And so on. But not for `uint4` itself. I've
  considered making exceptions to the trait system for this case, but have
  decided against it, because that would've introduced a very unpleasant
  inconsistency in a very common part of the language.
- **`Trait`**. It's a trait that enables the use of an object as a trait.
  `Type` must satisfy it, so it must be implemented for `Type`'s type. By this
  time you probably see the need to either recurse the implementation of both
  `Trait` and `Type`, or to introduce a helper type to act as a basic meta-type
  for the built-ins. I'm still undecided on this part. It's easy to get
  carried away when designing a self-referential system, so I'm trying to
  carefully evaluate every decision I take in terms of whether it is the
  simplest.
- **Tuples**. As I've already mentioned, tuples' types are represented by other
  tuples. More precisely, a tuple of types acts as a type, and a tuple of
  traits -- as a trait. This obviously requires some special support in the
  background.
- **Unit**. Not actually a separate case, literally just an empty tuple: `()`.
- **Numeric types**. I would prefer to not have special cases for them, except
  for optimization purposes, maybe. It seems feasible, but I'm missing a more
  general piece of the puzzle for that.
- **`str`**. Same deal, probably. Strings are UTF-8 and immutable, by the way.
  I'm going to take Python's approach and keep bytes separate. There will be
  standard library support for bytes, mutable strings, ascii strings and perhaps
  other encodings, but the default will be this.
- **Arrays**. Most likely not special neither. One thing I'm still undecided on
  here is how array types should be specified. C-style `uint4[5]` is already
  used for templates (angle brackets are bad for grammar!), and being unable to
  specify an array of generic types seems undesirable. I'm considering either
  Rust-style (`[uint4; 5]`) or Zig-style (`[5]uint4`). The latter feels more
  natural, but could theoretically collide with bracketed attributes, if I add
  those. On the other hand, it might as well be an overloadable operator...
- **References**. It's probably a good idea to clarify that so far, I'm only
  considering the `ctime` part of the language. `rtime` would require different
  fundamentals, but I hope all of them would be expressible in terms of `ctime`
  primitives. With that in mind, I'm not even sure if references are necessary
  for `ctime`. If everything is basically a shared pointer regardless, what
  would be the use case for these? Also, on a related note, there will most
  likely not be an operator to define the reference type. Using a generic
  `ref[uint4]` seems sufficient. On the other hand, maybe I could kill two
  birds with one stone and employ the left `&` as a customizable operator with
  no default meaning in `ctime`, and then define it for `Type` to mean taking
  a `ref`...
- **Structs**. Generally, the only special thing about structs is instance
  attribute access (`.` vs `::` for proper attributes). I'd say this is
  comfortably implemented via a trait (like ones for operator overloading, no
  magic). However, that leaves the question of where the data goes. Using a
  single proper attribute has the caveat of deferring the same issue down
  a level. Using a tuple wouldn't work because tuples are immutable by design.
  Using a proper attribute per field would work, but I'm considering some
  potential optimizations like what Python did with `__slots__`. If structs do
  end up receiving some special treatment, it might be worth it to employ them
  for the basic meta-types.
- **Enums**. This will most likely be used a lot for near-fundamental code.
  For instance, it only makes sense to implement `bool` as an enum. I'm aiming
  for Rust-like enums, i.e. tagged variants. In Rust, this comes with some
  syntactic sugar, but I feel like there's room for improvement there. I'm not
  sure what special treatment, if any, I should give to enums to achieve that.

As you can probably see, the issue is not really anything specific, but rather
the general uncertainty... If you have a strong opinion on anything mentioned
here, or if you have any other ideas or suggestions, feel free to contact me
over [email](mailto:{{ site.email }}) or any other means you have. I guess
the best way forward is to experiment, but I have yet to muster the
determination to do so. Hopefully, this post will have helped me with that.

_While writing this post, I've had a fruitful discussion with Andy Chu, the
creator of [Oil shells](https://www.oilshell.org/), on Reddit. Some parts of
this post have been first formulated in that discussion. I've also picked up
some prospective ideas for Bondrewd from it, which I might cover in future
posts. Moreover, I've learned of a previous attempt at a language with a
similar premise to Bondrewd, called [Terra](https://terralang.org/), as well as
its [shortcomings](https://erikmcclure.com/blog/a-rant-on-terra/). I'm thankful
for that discussion. While I'm at it, I'd like to mention that, if you're
interested in a better shell language than bash, you should definitely check
out the Oils project. It consists of a bash-compatible shell and a legacy-free
one, both of which are written in Python and transpiled to C++. Turns out, we
both rely on custom-tailored versions of the same parser stack (Pegen and ASDL),
which I've described in the [last post]({% post_url 2023-07-18-pegen++ %})._

_UPDATE: Added sections on structs and enums._
