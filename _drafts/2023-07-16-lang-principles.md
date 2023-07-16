---
title: "The Zen of Bondrewd"
date: 2023-07-16 00:00:00 +0300
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
  approach <dfn title='&#x795D;&#x798F;, jap. "Blessing"'>Shukufuku</dfn>.
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
- <span class="text-green-600">... TODO</span>
- The Zen of Python _mostly_ applies too &#x1F609;
