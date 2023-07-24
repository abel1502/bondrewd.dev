---
title: "The Zen of Bondrewd"
date: 2023-07-17 22:00:00 +0300
author: Andrew Belyaev
---

In this post I will outline the core philosophy behind the Bondrewd language --
why it exists, what it is meant to be, and, most importantly, what the design
choices should be based on.

_As a side note, in retrospect this has turned out more expansive than would've
been appropriate for a Zen, but I guess I'll keep the name as is._

- **Flexibility is key**  
  Bondrewd is meant to be a general-purpose language, and in my view, the most
  important property of one is flexibility. Whatever the user (the programmer)
  wishes to do, they should be able to, <ins>even if it's considered
  bad</ins>. The programmer is the one taking responsibility, so they should
  ultimately get the final say.

  This is largely inspired by Python's philosophy of having many restrictions
  only in the form of "gentlemen's agreements", rather than hard rules.
  Checked rules are still convenient every now and then, but they should be
  opt-in, not opt-out.

  There will be a few exceptions to this at the core of the language, because
  without any fixed rules, there would be no language at all. A more formal
  statement would be that the inflexible core part of the language will be kept
  to a minimum, and the rest will be implemented in the standard library in a
  first-class manner. Ideally, the core bits will also seem first-class from
  within the language.

  As for why -- well, with sufficient flexibility, (mostly) anything else can
  be built on top by the user. The two notable exceptions are convenient and
  simple syntax and performance, which are the next two points.
- **Performance is important**  
  Runtime performance, specifically. If you're not interested in performance,
  Python more than satisfies the previous point. However, flexibility alone
  not only cannot provide performance, but is somewhat at odds with it.
  Bondrewd's solution is to provide the flexibility at compile time, yet
  result in a binary that is as fast as if it was written in C++ or Rust.
  
  Actually, if you dig a bit deeper, you'll find Python libraries like
  [Numba](https://numba.pydata.org/), which compile parts of Python code
  either ahead-of-time or just-in-time. However, there are some flaws with an
  approach like this. Generally speaking, the issue is that Python's semantics
  are designed with interpreted execution in mind. Since Numba has to work with
  functions written in Python, the expressiveness of the to-be-compiled code is
  limited significantly. For almost the same reason, it cannot be used to
  compile the whole program into a standalone binary _(without packaging the
  entire Python interpreter with it)_. Bondrewd, on the other hand, comes with
  deliberate support for compilation on various levels, so it should make for
  a much better user experience in this regard.
- **Syntax should provide what the library cannot**  
  For a general-purpose language, common tasks must have convenient and simple
  syntax. However, the language should not try to provide everything, as that
  would end up an unmanageable bloat. Instead, Bondrewd provides syntactic
  facilities for the most general tasks, and for the rest, the user is expected
  to tolerate the slight syntactic inconvenience of procedural macros.
- **The program is its compilation script**  
  This is a corollary of the previous points. The simplest way to provide the
  most flexibility at compile-time is to treat the program not as a
  declarative definition, but as imperative instruction for what the compiled
  binary should contain. For semi-arbitrary reasons, I have dubbed this
  approach {{ site.shukufuku_translation }}.
  Theoretically, any interpreted language could implement this, but since
  Bondrewd is designed with it in mind, it provides specific syntax for
  runtime code literals (i.e. functions, and generally everything
  non-compile-time you would expect in a traditional program). This way,
  programs not utilizing compile-time metaprogramming don't suffer from added
  syntactic clutter, like they otherwise would've if Shukufuku had been
  added as a library feature to an existent language. _(That being said,
  the aforementioned Numba can be treated, to some extent, as a Python
  Shukufuku library)_.
- **Encouraged solutions should be the simplest ones**  
  Or, on the flip side, complexity should be used as a tool to deter
  programmers from discouraged actions. This is really an extension to the
  very first idea. Something being discouraged, or even outright bad, is not
  a good enough reason to forbid it. It is, however, a reason to avoid
  facilitating the discouraged approach. This way, the programmer is drawn
  to the "right" way, but is still free to choose any other if they know
  what they're doing.
- **Maintain familiarity to programmers**  
  While a radical or novel approach is usually the core of a language's
  identity, it also acts as a barrier to entry. Bondrewd already has a set
  of defining ideas, so it should try to avoid pointless deviations in other
  areas. In particular, this implies a syntax in large parts borrowed from
  other languages _(mostly Rust, and in some cases Python, at least at the
  time of writing)_. I should, however, point out, that in cases where some
  syntax or semantics could be slightly adjusted for a sufficient increase
  in generality and composability, such changes should definitely be considered.
- **Don't violate programmer expectations**  
  _Unless they originate in bad habits, maybe._ The idea here is that a simple
  and flexible language should be predictable by default thanks to high
  composability and regular internal structure following the same rules as
  user code. This property is very prominent in Python, which is one of my
  favorite aspects of that language. Really, this rule can be paraphrased as
  _"avoid making exceptions"_.
- <sub>_This is a stupid one, but_</sub> **Insert a few Made in Abyss references
  here and there**  
  Since I have already named the language after a character from the series,
  I feel compelled to include a few references to it as well. As of right now,
  you may have already noticed that the packages are referred to as
  "cartridges", and I'm thinking of referring to the root-of-all-namespaces,
  to which all cartridges belong, as a "backpack". Another cool idea has been
  suggested, but I won't specify it here to avoid spoiling the series for
  those who haven't watched it yet. _(I highly recommend it, by the way!)_
- <span class="text-green-600">TODO?...</span> -- maybe there's something
  crucial that I forgot to mention. If that turns out to be the case, I'll
  add it here. This is also your chance to propose a core principle to the
  language while it's still in its infancy.
- The Zen of Python _mostly_ applies too &#x1F609;

<!--
TODO: Update about the similarity and distinctions between rtime and ctime
languages, based on the discussion with Andy Chu.

The full discussion, for reference:

https://www.reddit.com/r/ProgrammingLanguages/comments/155t03q/comment/jt83vp9/?utm_source=share&utm_medium=web2x&context=3

> abel1502r
I'm writing my bootstrap compiler in C++, but all of my code generation tools
so far are written in python. Jinja templates are far better for this than any
other alternatives I've seen, especially when you need extensive calculations
behind the scene to generate the payload. Here's a link, if you're interested.
asdl++ generates the AST classes, pegen++ generates the parser and tokens
generates the lexing automatas and some related enums


> oilshell:
Ha cool! Oils is using both ASDL and pgen2 with C++ back ends as well. It's
been all over the blog, not particularly organized, but I may write up an
architecture description later:

https://www.oilshell.org/blog/2022/03/middle-out.html

https://www.oilshell.org/blog/tags.html?tag=ASDL#ASDL

I've indeed found it useful to borrow metalanguages from Python itself. Also
MyPy has been very useful.

I took at look at https://bondrewd.readthedocs.io/en/latest/ , seems interesting

I have a long-term idea to do something similar. Oils is made faster via a
translator from statically typed Python to C++ called "mycpp". And we have our
own runtime for mycpp.

There are some cool parts of the runtime that I would like to expose to users
eventually. Basically "hoisting" our tools up to the user level.

The funny thing is that it naturally leads to an architecture where you have a
"YSH" for metaprogramming a faster language "Tea".
It would basically be like if:

shell was a good language

the C preprocessor and shell were the SAME language (they are kinda similar if
you squint?)

So you have a single good dynamic language for metaprogramming a fast language

Anyway, if you want a bunch of real use cases for compile-time metaprogramming,
we have many. We use textual code generation, with 3 major code generators and
maybe 7 minor ones, but it would be nice if the metalanguage had real
compile-time execution.


> abel1502r:
Cooperating with Oils would be cool, but I fear it's still quite a distant
goal. At the moment, I'm stuck on properly designing ang implementing the
compile-time language's self-referential core (i.e., what CPython does for
type and object, except with traits and a lot of other nuances). Recently,
I've been excusing my procrastination with this by focusing on the language's
website, which, by the way, has a blog with somewhat more up-to date
information on the language than the docs. I'm actually writing a post on
the aforementioned issue and the related concepts right now.

I do like the ideas, though, (both of putting Bondrewd to good use for
metaprogramming in an existing project, and of tighter interactions between
the shell and a metaprogramming language), and will absolutely look into them
after reaching a sufficient working prototype


> oilshell:
Cool, I checked out the blog posts

I'm excited for your journey :) IMO the beginning is the most fun part of
making a language -- you can explore anything

Now that I've been doing this for over 7 years, I'm still having fun, but I
have to resist the urge to go on tangents :)

One thing I find interesting is whether the metaprogramming language is the
same as the language, or different

For a compiled language, there are some big tradeoffs there
(e.g. memory management and safety)

It makes me think of Lua/Terra as well -- I remember there was a great research
paper on the system, but the gap between research and production is VERY large

https://erikmcclure.com/blog/a-rant-on-terra/


> abel1502r:
Thanks!

I've conducted a lot of mental experiments relating to this, and have come to
these conclusions:

The compile-time and run-time languages are intertwined -- for ctime code,
rtime definitions are really just a special kind of literals, and for rtime
code, ctime code can be embedded all over the place (like a text template, but
semantic instead of textual)

As much as possible should be common between the two languages. I almost want
to say they should be the same, but there are a few significant caveats[1]

The user must clearly realize the distinction between the two, even if they
were identical in terms of syntax and semantics, because of their different
roles towards each other.

The ctime language should support itself in the same way it does to the rtime
language

Because of that, I'll say they are different languages, but are designed with
this specific interoperation in mind. The grammar is actually the same, but,
for instance, the value semantics are different. For rtime, each value is
uniquely owned by something, whereas for ctime values are shared with reference
counting. This, on the one hand, aims to better fit the underlying platform,
but also resolves some otherwise confusing moments (see below).

[1]: For example, types are regular ctime objects (both for rtime and ctime).
If they were subject to the same ownership semantics as runtime values, the
construct `let a: uint4 = 1` would either move or copy the global uint4. Move
is obviously undesirable. Copy seems fine at first glance, but demanding all
types be trivially copyable has its issues. It would mean types cannot have
proper attributes, because those would be tied to a specific copy, rather than
the type itself. So, defining something like `uint4::MAX` would only affect the
following usages of the type, but not the already processed ones.
The alternative is to demand explicit passing by reference, however
`let a: &uint4 = 1` would be extremely confusing.

Another inevitable semantic difference is forward references. While for rtime
code those could be automatically resolved at compile-time, for ctime code
this would be computationally inefficient, confusing and often impossible.
So instead I chose to do what Python does, requring everything to be defined
by the time of first usage.

Appropriate rtime code can still be interpreted at ctime for the purposes of
constant-folding and inlining. This, however, has to be done consciously, to
avoid confusion about the boundaries between rtime and ctime. Probably, rtime
code will also be able to interact with ctime constructs through a specific
interface, similar to how Python allows C extension libraries.

As for Terra, this is the first time I've heard of it, and its premise does
seem quite similar to Bondrewd's. I'll look into it in more detail, to
hopefully learn from their experience if there's something I'm doing severely
wrong. However, I like to think I've avoided some of the more severe issues
they have, according to that blogpost. I've actually considered just making a
Python library to simplify writing programs as compilation scripts, but have
decided against it. While both Lua and Python are self-implemented (if observed
from within the language), the runtime language on top of them would have to be
integrated into the same mechanism in order to be sufficiently uniform, and
that would make it poorly suited for performance-sensitive runtime evaluation

-->
