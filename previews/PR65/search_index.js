var documenterSearchIndex = {"docs":
[{"location":"examples/findminmax/","page":"findminmax","title":"findminmax","text":"EditURL = \"https://github.com/JuliaFolds/FoldsCUDA.jl/blob/master/examples/findminmax.jl\"","category":"page"},{"location":"examples/findminmax/#findminmax","page":"findminmax","title":"findminmax","text":"","category":"section"},{"location":"examples/findminmax/","page":"findminmax","title":"findminmax","text":"using Transducers\nusing CUDA\nusing FoldsCUDA\nusing FLoops\n\nfunction findminmax(xs, ex = xs isa CuArray ? CUDAEx() : ThreadedEx())\n    xtypemax = typemax(eltype(xs))\n    xtypemin = typemin(eltype(xs))\n    @floop ex for (i, x) in pairs(xs)\n        @reduce() do (imin = -1; i), (xmin = xtypemax; x)\n            if xmin > x\n                xmin = x\n                imin = i\n            end\n        end\n        @reduce() do (imax = -1; i), (xmax = xtypemin; x)\n            if xmax < x\n                xmax = x\n                imax = i\n            end\n        end\n    end\n    return (; imin, xmin, imax, xmax)\nend\n\nfunction findminmax_base(xs)\n    xmin, imin = findmin(xs)\n    xmax, imax = findmax(xs)\n    return (; imin, xmin, imax, xmax)\nend\nnothing  # hide","category":"page"},{"location":"examples/findminmax/","page":"findminmax","title":"findminmax","text":"xs = [700, 900, 500, 200, 700, 700, 900, 300, 600, 400, 900, 600, 900, 800, 600]\nif has_cuda_gpu()\n    xs = CuArray(xs)\nend\n\nresult = findminmax(xs)","category":"page"},{"location":"examples/findminmax/","page":"findminmax","title":"findminmax","text":"@assert result == findminmax_base(xs)","category":"page"},{"location":"examples/findminmax/","page":"findminmax","title":"findminmax","text":"","category":"page"},{"location":"examples/findminmax/","page":"findminmax","title":"findminmax","text":"This page was generated using Literate.jl.","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"EditURL = \"https://github.com/JuliaFolds/FoldsCUDA.jl/blob/master/examples/inplace_mutation_with_referenceables.jl\"","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/#In-place-mutation-with-Referenceables.jl","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"","category":"section"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"using CUDA\nusing Folds\nusing FoldsCUDA\nusing Referenceables: referenceable","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/#Simple-mutation","page":"In-place mutation with Referenceables.jl","title":"Simple mutation","text":"","category":"section"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"function increment_folds!(xs)\n    Folds.foreach(referenceable(xs)) do x\n        x[] += 1\n    end\n    return xs\nend\n\nif has_cuda_gpu()\n    xs = CuArray(1:5)\nelse\n    xs = Array(1:5)\nend\n\ncollect(increment_folds!(xs))","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"This can also be written with FLoops.jl:","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"using FLoops\n\nfunction increment_floops!(xs, ex = nothing)\n    @floop ex for x in referenceable(xs)\n        x[] += 1\n    end\n    return xs\nend\n\ncollect(increment_floops!(xs))","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/#Fusing-reduction-and-mutationg","page":"In-place mutation with Referenceables.jl","title":"Fusing reduction and mutationg","text":"","category":"section"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"Computing sum(f, xs) and f.(xs) in one go:","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"function mutation_with_folds(f, xs)\n    ys = similar(xs)\n    s = Folds.sum(zip(referenceable(ys), xs)) do (r, x)\n        r[] = y = f(x)\n        return y\n    end\n    return s, ys\nend\nnothing  # hide","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"if has_cuda_gpu()\n    xs = CuArray(1:5)\nelse\n    xs = Array(1:5)\nend\n\ns, ys = mutation_with_folds(x -> x^2, xs)\ns","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"collect(ys)","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"An equilvalent computaton with FLoops.jl:","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"using FLoops\n\nfunction mutation_with_floop(f, xs)\n    ys = similar(xs)\n    z = zero(eltype(ys))\n    @floop for (r, x) in zip(referenceable(ys), xs)\n        r[] = y = f(x)\n        @reduce(s = z + y)\n    end\n    return s, ys\nend\nnothing  # hide","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"@assert mutation_with_folds(x -> x^2, xs) == (s, ys)","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"","category":"page"},{"location":"examples/inplace_mutation_with_referenceables/","page":"In-place mutation with Referenceables.jl","title":"In-place mutation with Referenceables.jl","text":"This page was generated using Literate.jl.","category":"page"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"EditURL = \"https://github.com/JuliaFolds/FoldsCUDA.jl/blob/master/examples/reduce_partition_by.jl\"","category":"page"},{"location":"examples/reduce_partition_by/#Partition-reduce-on-GPU","page":"Partition reduce","title":"Partition reduce on GPU","text":"","category":"section"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"By using ReducePartitionBy, per-partition (group) can be computed on GPU in a streaming (single-pass) fashion.","category":"page"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"using CUDA\nusing CUDA: @allowscalar\n\nn = 2^24\nif has_cuda_gpu()\n    xs = CUDA.randn(n)\nelse\n    xs = randn(n)\nend\nnothing # hide","category":"page"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"ReducePartitionBy expects partition to be contiguous; e.g., sorted by the key. We will use floor as the key. So, plain sort! works in this example.","category":"page"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"sort!(xs)\nnothing # hide","category":"page"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"In GPU, it is convenient to know the output location before computation. So, let us build unique index for each partition using cumsum!:","category":"page"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"function buildindices(f, xs)\n    isedge(x, y) = !isequal(f(x), f(y))\n    bounds = similar(xs, Bool)\n    @views map!(isedge, bounds[2:end], xs[1:end-1], xs[2:end])\n    @allowscalar bounds[1] = true\n    partitionindices = similar(xs, Int32)\n    return cumsum!(partitionindices, bounds)\nend\n\npartitionindices_xs = buildindices(floor, xs)\nnothing # hide","category":"page"},{"location":"examples/reduce_partition_by/#Counting-the-size-of-each-partition","page":"Partition reduce","title":"Counting the size of each partition","text":"","category":"section"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"import FoldsCUDA  # register the executor\nusing FLoops\nusing Transducers\n\nfunction countparts(partitionindices; ex = nothing)\n    nparts = @allowscalar partitionindices[end]\n    ys = similar(partitionindices, nparts)\n\n    # The intra-partition reducing function that reduces each partition to\n    # a 2-tuple of index and count:\n    rf_partition = Map(p -> (p, 1))'(ProductRF(right, +))\n\n    index_and_count =\n        partitionindices |>\n        ReducePartitionBy(\n            identity,  # partition by partitionindices\n            rf_partition,\n            (-1, 0),\n        )\n\n    @floop ex for (p, c) in index_and_count\n        @inbounds ys[p] = c\n    end\n\n    return ys\nend\n\nc_xs = countparts(partitionindices_xs)","category":"page"},{"location":"examples/reduce_partition_by/#Computing-the-average-of-each-partition","page":"Partition reduce","title":"Computing the average of each partition","text":"","category":"section"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"function meanparts(xs, partitionindices; ex = nothing)\n    nparts = @allowscalar partitionindices[end]\n    ys = similar(xs, float(eltype(xs)), nparts)\n\n    # The intra-partition reducing function that reduces each partition to\n    # a 3-tuple of index, count and sum:\n    rf_partition = Map(((i, p),) -> (p, 1, (@inbounds xs[i])))'(ProductRF(right, +, +))\n\n    index_count_and_sum =\n        pairs(partitionindices) |>\n        ReducePartitionBy(\n            ((_, p),) -> p,  # partition by partitionindices\n            rf_partition,\n            (-1, 0, zero(eltype(ys))),\n        )\n\n    @floop ex for (p, c, s) in index_count_and_sum\n        @inbounds ys[p] = s / c\n    end\n\n    return ys\nend\n\nm_xs = meanparts(xs, partitionindices_xs)","category":"page"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"","category":"page"},{"location":"examples/reduce_partition_by/","page":"Partition reduce","title":"Partition reduce","text":"This page was generated using Literate.jl.","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"EditURL = \"https://github.com/JuliaFolds/FoldsCUDA.jl/blob/master/examples/histogram_msd.jl\"","category":"page"},{"location":"examples/histogram_msd/#Histogram-of-the-most-significant-digit-(MSD)","page":"Histogram of MSD","title":"Histogram of the most significant digit (MSD)","text":"","category":"section"},{"location":"examples/histogram_msd/#An-allocation-free-function-to-compute-MSD","page":"Histogram of MSD","title":"An allocation-free function to compute MSD","text":"","category":"section"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"function msd(x::Real)\n    x = abs(x)\n    d = x\n    while true\n        x < 1 && return floor(Int, d)\n        d = x\n        x ÷= 10\n    end\nend\nnothing  # hide","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"msd(34513)","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"msd(-51334)","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"msd(2.76e19)","category":"page"},{"location":"examples/histogram_msd/#MSD-of-random-numbers","page":"Histogram of MSD","title":"MSD of random numbers","text":"","category":"section"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"using CUDA\nusing FLoops\nusing FoldsCUDA\nusing Setfield\n\nfunction histogram_msd(xs, ex = nothing)\n    zs = ntuple(_ -> 0, 9)  # a tuple of 9 zeros\n    @floop ex for x in xs\n        d = msd(x)\n        1 <= d <= 9 || continue  # skip it if `msd` returns 0\n        h2 = @set zs[d] = 1      # set `d`-th position of the tuple to 1\n        @reduce(h1 = zs .+ h2)   # point-wise addition merges the histogram\n    end\n    return h1\nend\nnothing  # hide","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"Generate some random numbers","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"xs = let randn = has_cuda_gpu() ? CUDA.randn : randn\n    exp.(10.0 .* (randn(10^8) .+ 6))\nend\n@assert all(isfinite, xs)\ncollect(view(xs, 1:10))  # preview","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"Pass an array of (real) numbers to histogram_msd to compute the histogram of MSD:","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"hist1 = histogram_msd(xs)","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"Frequency in percentage:","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"aspercentage(h) = pairs(round.((collect(h) ./ length(xs) .* 100); digits = 1))\naspercentage(hist1)","category":"page"},{"location":"examples/histogram_msd/#MSD-of-lazily-computed-numbers","page":"Histogram of MSD","title":"MSD of lazily computed numbers","text":"","category":"section"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"FoldsCUDA supports running reduction over non-CuArray containers such as UnitRange and iterator transformation wrapping it. However, you need to explicitly specify to use CUDA by, e.g., passing CUDAEx to @floop:","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"hist2 = histogram_msd(x^2 for x in 1:10^8)","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"Frequency in percentage:","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"aspercentage(hist2)","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"hist3 = histogram_msd(exp(x) for x in range(1, 35, length=10^8))","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"Frequency in percentage:","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"aspercentage(hist3)","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"","category":"page"},{"location":"examples/histogram_msd/","page":"Histogram of MSD","title":"Histogram of MSD","text":"This page was generated using Literate.jl.","category":"page"},{"location":"examples/#examples-toc","page":"Examples","title":"Examples","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"Pages = [\"examples/findminmax.md\", \"examples/histogram_msd.md\", \"examples/monte_carlo_pi.md\", \"examples/inplace_mutation_with_referenceables.md\", \"examples/reduce_partition_by.md\"]\nDepth = 3","category":"page"},{"location":"deprecated/#Deprecated-API","page":"Deprecated API","title":"Deprecated API","text":"","category":"section"},{"location":"deprecated/","page":"Deprecated API","title":"Deprecated API","text":"FoldsCUDA.foldx_cuda\nFoldsCUDA.transduce_cuda","category":"page"},{"location":"deprecated/#FoldsCUDA.foldx_cuda","page":"Deprecated API","title":"FoldsCUDA.foldx_cuda","text":"foldx_cuda(op[, xf], xs; init)\ntransduce_cuda(xf, op, init, xs)\n\nExtended fold backed up by CUDA.\n\n\n\n\n\n","category":"function"},{"location":"deprecated/#FoldsCUDA.transduce_cuda","page":"Deprecated API","title":"FoldsCUDA.transduce_cuda","text":"foldx_cuda(op[, xf], xs; init)\ntransduce_cuda(xf, op, init, xs)\n\nExtended fold backed up by CUDA.\n\n\n\n\n\n","category":"function"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"EditURL = \"https://github.com/JuliaFolds/FoldsCUDA.jl/blob/master/examples/monte_carlo_pi.jl\"","category":"page"},{"location":"examples/monte_carlo_pi/#Estimating-π-using-Monte-Carlo-method","page":"Monte-Carlo π","title":"Estimating π using Monte-Carlo method","text":"","category":"section"},{"location":"examples/monte_carlo_pi/#Idea","page":"Monte-Carlo π","title":"Idea","text":"","category":"section"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"Let's compute an approximation of π using the Monte Carlo method.  The idea is to draw points from the uniform distribution on a unit square and count the ratio of points that are inside the quadrant of the unit circle.  Since the probably p for a point to be inside the quadrant is the area of the quadrant (= π  4) divided by the area of the unit square (= 1), we can estimate π by estimating the probability p = π  4:","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"xs = rand(10_000)\nys = rand(10_000)\np = count(xs.^2 .+ ys.^2 .< 1) / length(xs)\n4 * p","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"(Image: Illustration of monte-Carlo method for computing pi)–- File:Pi 30K.gif - Wikipedia by nicoguaro is licensed under CC BY 3.0.","category":"page"},{"location":"examples/monte_carlo_pi/#RNG-on-GPU","page":"Monte-Carlo π","title":"RNG on GPU","text":"","category":"section"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"We try to do this computation on a GPU using FoldsCUDA.jl:","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"using CUDA\nusing FLoops\nusing FoldsCUDA","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"As of writing, CUDA.CURAND does not provide the API usable inside the loop body (i.e., the device API).  However, we can use pure-Julia pseudo number generator quite easily.  In particular, we use a Counter-based random number generator (CBRNG) provided by Random123.jl (documentation).","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"using Random123","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"In this example, we use Random123.Philox2x. This RNG gives us two UInt64s for each counter which wraps around at typemax(UInt64):","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"rng_a = Philox2x(0)\nrng_b = Philox2x(0)\nset_counter!(rng_b, typemax(UInt64))\nrand(rng_b, UInt64, 2)\n@assert rng_a == rng_b","category":"page"},{"location":"examples/monte_carlo_pi/#Using-counter-based-RNG","page":"Monte-Carlo π","title":"Using counter-based RNG","text":"","category":"section"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"Let's create a helper function that divides UInt64(0):typemax(UInt64) into n equal intervals:","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"function counters(n)\n    stride = typemax(UInt64) ÷ n\n    return UInt64(0):stride:typemax(UInt64)-stride\nend\nnothing  # hide","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"This lets us use \"independent\" RNG for each ctr-th iteration:","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"function monte_carlo_pi(n, m = 10_000, ex = has_cuda_gpu() ? CUDAEx() : ThreadedEx())\n    @floop ex for ctr in counters(n)\n        rng = set_counter!(Philox2x(0), ctr)\n        nhits = 0\n        for _ in 1:m\n            x = rand(rng)\n            y = rand(rng)\n            nhits += x^2 + y^2 < 1\n        end\n        @reduce(tot = 0 + nhits)\n    end\n    return 4 * tot / (n * m)\nend\nnothing  # hide","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"πₐₚₚᵣₒₓ = monte_carlo_pi(2^12)","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"","category":"page"},{"location":"examples/monte_carlo_pi/","page":"Monte-Carlo π","title":"Monte-Carlo π","text":"This page was generated using Literate.jl.","category":"page"},{"location":"","page":"FoldsCUDA.jl","title":"FoldsCUDA.jl","text":"CurrentModule = FoldsCUDA","category":"page"},{"location":"#FoldsCUDA.jl","page":"FoldsCUDA.jl","title":"FoldsCUDA.jl","text":"","category":"section"},{"location":"","page":"FoldsCUDA.jl","title":"FoldsCUDA.jl","text":"FoldsCUDA\nFoldsCUDA.CUDAEx","category":"page"},{"location":"#FoldsCUDA.FoldsCUDA","page":"FoldsCUDA.jl","title":"FoldsCUDA.FoldsCUDA","text":"FoldsCUDA\n\n(Image: Dev) (Image: Buildkite status) (Image: Run tests w/o GPU)\n\nFoldsCUDA.jl provides Transducers.jl-compatible fold (reduce) implemented using CUDA.jl.  This brings the transducers and reducing function combinators implemented in Transducers.jl to GPU.  Furthermore, using FLoops.jl, you can write parallel for loops that run on GPU.\n\nAPI\n\nFoldsCUDA exports CUDAEx, a parallel loop executor. It can be used with the parallel for loop created with FLoops.@floop, Base-like high-level parallel API in Folds.jl, and extensible transducers provided by Transducers.jl.\n\nExamples\n\nfindmax using FLoops.jl\n\nYou can pass CUDA executor FoldsCUDA.CUDAEx() to @floop to run a parallel for loop on GPU:\n\njulia> using FoldsCUDA, CUDA, FLoops\n\njulia> using GPUArrays: @allowscalar\n\njulia> xs = CUDA.rand(10^8);\n\njulia> @allowscalar xs[100] = 2;\n\njulia> @allowscalar xs[200] = 2;\n\njulia> @floop CUDAEx() for (x, i) in zip(xs, eachindex(xs))\n           @reduce() do (imax = -1; i), (xmax = -Inf32; x)\n               if xmax < x\n                   xmax = x\n                   imax = i\n               end\n           end\n       end\n\njulia> xmax\n2.0f0\n\njulia> imax  # the *first* position for the largest value\n100\n\nextrema using Transducers.TeeRF\n\njulia> using Transducers, Folds\n\njulia> @allowscalar xs[300] = -0.5;\n\njulia> Folds.reduce(TeeRF(min, max), xs, CUDAEx())\n(-0.5f0, 2.0f0)\n\njulia> Folds.reduce(TeeRF(min, max), (2x for x in xs), CUDAEx())  # iterator comprehension works\n(-1.0f0, 4.0f0)\n\njulia> Folds.reduce(TeeRF(min, max), Map(x -> 2x)(xs), CUDAEx())  # equivalent, using a transducer\n(-1.0f0, 4.0f0)\n\nMore examples\n\nFor more examples, see the examples section in the documentation.\n\n\n\n\n\n","category":"module"},{"location":"#FoldsCUDA.CUDAEx","page":"FoldsCUDA.jl","title":"FoldsCUDA.CUDAEx","text":"CUDAEx()\n\nA fold executor implemented using CUDA.jl.\n\nFor more information about executor, see Transducers.jl's glossary section and FLoops.jl's API section.\n\nExamples\n\njulia> using FoldsCUDA, Folds\n\njulia> Folds.sum(1:10, CUDAEx())\n55\n\n\n\n\n\n","category":"type"}]
}
