---
title: Better semantic uniformity
date: 2023-09-08 23:00:00 +0300
author: Andrew Belyaev
---

_First of all, I'd like to apologize for the delay in publishing this post. I've
been busy with personal matters, and have not had much time to work on
Bondrewd. Hopefully, now that the semester has started, I'll be able to work on
it more regularly._

I've been continuously analyzing my design choices to try and find bits
that displease me (rather than actually writing the code, as I probably should
have been). I believe I've just found one.

In the last post I mentioned that Bondrewd's `ctime` and `rtime`
sublanguages would inevitably have semantic differences, despite my desire to
maintain uniformity between the two. My primary reason had been that users
expect types and other similar unique compile-time objects to be shared by
default, rather than moved. I do still believe this is the case, however I've
found a way to potentially mitigate this issue in a way, which would
simultaneously meet users' expectations and remove the disparity between the
two sublanguages. The idea is to **still have ownership semantics, but allow
implicitly taking references** in `ctime` code.

This is, to some extent, in contrast to the primary source of inspiration for
Bondrewd's references -- Rust. However, I have a few arguments in support of
this decision. For one, we have already taken a similar decision previously,
in allowing user-defined implicit casts. While I suspect it wouldn't be
entirely possible to implement implicit reference taking via implicit casts,
it still seems to fall under the same philosophy: a possibility of misuse in
not a sufficient reason to refuse a feature. Second, both Bondrewd and Rust, in
fact, already have implicit reference taking in a specific scenario -- for
`self` arguments. If it's allowed in one case, uniformity suggests that it
shouldn't be forbidden in general.

As for the benefits, besides the general appreciation of uniformity, this
approach also brings explicit ownership to `ctime`. Compared to the Pythonic
'everything-is-shared' model, Bondrewd's owning `ctime` would convey more
information to the user and highlight a category of logical bugs.

It's important to note that if necessary, shared ownership can still be
achieved with an explicit opt-in (via the equivalent of C++'s `shared_ptr`).

The feature does come at a slight cost in clarity, though. For example, while
the recommended way to declare an integer variable would be something like
`let a: uint4 = 42;`, a perfectly legal alternative would be
`let a: &uint4 = 42;`. This is contrary to the expectations of a programmer
familiar with Rust or C++, who could assume `a` to be a reference to `uint4`
instead. It's a significant enough source of confusion that I certainly
intend to introduce a compiler warning for explicit references in cases like
this. However, there's another change that I've been considering independently,
that can also address this issue. I'm talking about postfix reference syntax.
I'm not yet settled on the nuances, but I envision something like `foo.&` for
taking a reference and `foo.*` for dereferencing. The primary motivation for
this feature is to eliminate unnecessary parentheses in code working with
references, but it might also help people with backgrounds in other languages
distinguish a reference to a type object (`uint4.&`) from a reference type
(for which I have not yet settled on a particular syntax. `ref[uint4]`,
perhaps?).

Implicit references seem positive enough overall to be introduced to `ctime`
(and, obviously, `self` arguments, where it had already existed). However,
as for `rtime`, so far I feel opposed to the idea. I might change my mind, but
with Rust, forbidding it felt like a step in the right direction. Maybe it
could be opted in within a lexical scope. _(By the way, compiler flags are
absolutely NOT the way to do it. I'll post about it at some later point,
perhaps)_. But I don't see any harm in leaving it out until a later point in
development.

_As for the now-almost-obligatory endnote, I'll once again apologize for
falling out of development schedule for a while. I guess I can also brag that
I've passed my driving license test, as well as TOEFL in my time out. Also,
if you're reading this post within a day from when it came out, you've
surpassed my expectations, thanks!_ &#x1f601;
