---
title: Pegen++ parser generator
# date: 2023-07-## ##:00:00 +0300
author: Andrew Belyaev
---

This post is dedicated to the parser generator used in Bondrewd. It is
based on the [Pegen](https://github.com/we-like-parsers/pegen) parser, a
version of which is used in CPython 3.9+. Both Pegen and Pegen++ are written
in Python, however the target languages differ. Pegen generates a parser in
Python as well. Its version used in CPython generates C code, however it is
tightly coupled with CPython's internals, so it is not usable outside of it.
Pegen++ generates C++ code, and is specifically designed with Bondrewd's
internals in mind. It should, however, be feasible to convert it for use in
another C++ project with minimal effort.

<!-- TODO: Explain PEG, its benefits and the metagrammar
    (along with the differences in it) -->

<!-- TODO: Also cover ASDL++ -->
