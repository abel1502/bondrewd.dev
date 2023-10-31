---
title: Context &gt; Global
# date: 2023-10-## ##:00:00 +0300
author: Andrew Belyaev
---

Maybe it's yet another excuse to put off actually writing the code, but I think
I've stumbled across a very important concept that will probably become a core
part of Bondrewd: context variables. You might be familiar with Python's
[contextvars](https://docs.python.org/3/library/contextvars.html) module, and
the usage semantics would be similar, but I believe my implementation would
be more reliable, especially with custom non-local control flow (i.e. `async`
stuff, `longjump`s, and the likes, which by the way should be implementable
without any special compiler support).

To put it simply, context variables combine the convenience of global variables
with the robustness of function parameters. Global variables are problematic
in several ways: they introduce strong coupling; automatically leak outside
the intended scope of use _(for instance, with `async` or even threads, as 
well as in tests)_; have ambiguous initialization order _(the invariant of
'any global is always available' cannot hold during the initialization of one)_;
and often compromise purity of functions. Function parameters are free of these
issues, but their downside is the need to explicitly repeat them for every
function call. This becomes even graver the function call is implicit, such as
with arithmetic operators. Another issue is the waste of stack memory on
duplicating everything passed this way for every call.

To the programmer, context variables look almost entirely like globals, with
only two differences. The first is that context variables are actually passed
through a hidden parameter. This means that they'll work automatically with
`async` functions, multithreading, partially-bound delegates, and so on. The
second difference is that context variables must be set with a clearly defined
scope of application:

```bondrewd
// Declaring a context variable
@context
let foo: Foo;

// Using `foo` here would be an error, because it's not set yet

with foo = Foo() {
    // Anything here, including any nested function calls, will have access
    // to the value we set for `foo`.
    // If something is running in parallel, be it `async` or threaded, they
    // won't be affected by this, however
};

// And now `foo` is no longer available once again

{
    // You can also set a context variable until the end of the current block
    // without the extra indentation
    with foo = Foo::new();

    // `foo` is avaiable again
};

// And it's gone after the block has ended
```

This might seem like a minor change at first, but think of how much global
state is there in the standard library of any general-purpose language
nowadays. Not only are there little things like `errno` and `static` buffers
in some `libc` functions, but there's also the standard IO streams, the file
system, network and peripherals. You might argue those are rightfully global
state, but what if, for example, a part of your code is meant to be executed
on a different machine, on the GPU as a shader, or even just in a different
process? Really, they constitute the contextual state of the `main` function.
I think this is a very important distinction.

But we haven't addressed one more issue context variables have inherited from
function parameters: the extra stack usage. The good news is, it's better
(or at least not worse) than manually passing the argument around. The
variable itself is allocated once on the stack, and then passed by reference
only to those functions that actually need it. (Context variables are still
subject to static type-checking, just like function arguments, despite
being implicit). Other optimizations could also be implemented, but I'll
probably leave it to library authors until a sufficiently general approach
arises.

On a side note, I'd like to mention a few small features that could be useful
in conjunction with context variables. ...

