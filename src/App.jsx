
function App() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-900 to-slate-800 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Algorithm Visualizer
        </h1>
        <p className="mt-4 text-slate-300 sm:text-lg">
          Showing "Closest Pair" and "Integer Matrix Multiplication" visualizations in this platform
        </p>

        <section className="mt-10 w-full rounded-2xl bg-slate-800/60 p-8 ring-1 ring-white/10">
          <h2 className="text-left text-sm font-semibold uppercase tracking-wider text-slate-400">
            Team
          </h2>
          <ul className="mt-3 justify-center gap-4 text-left sm:grid-cols-2">
            <li className="rounded-md bg-slate-900/40 px-4 py-2 m-3">Abdul Rahman Azam</li>
            <li className="rounded-md bg-slate-900/40 px-4 py-2 m-3">Raghib Rizwan</li>
            <li className="rounded-md bg-slate-900/40 px-4 py-2 m-3 sm:col-span-2">Talha Rusman</li>
          </ul>

          <div className="mt-8 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Lecturer
            </h3>
            <p className="mt-2 inline-block rounded-md bg-slate-900/40 px-4 py-2 m-3">Kamran</p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#/closest-pair"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-900 shadow hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              Closest Pair
            </a>
            <a
              href="#/integer-matrix-multiplication"
              className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-900 shadow hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              Integer Matrix Multiplication
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
