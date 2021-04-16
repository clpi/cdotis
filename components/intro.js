import Link from 'next/link'

export default function Intro( props ) {
  return (
    <section className="items-center max-h-screen min-h-screen pt-8 mb-16 md:flex-row md:justify-between md:mb-12">
    <div class="rounded-lg shadow">
      <div className="px-4 py-1 border-t border-indigo-500 rounded-t-lg bg-gradient-to-b from-indigo-400 to-blue-300 opacity-90">
      <h1 className="pt-16 pb-0 text-2xl leading-tight tracking-tighter text-gray-800 font-extralight md:text-7xl md:pr-8">
        <Link href="/">
          <span class="ml-4 text-white opacity-70">chris</span>
        </Link>
        <span className = "ml-4 text-lg leading-tight tracking-tighter text-gray-100 opacity-60 font-extralight md:text-6xl md:pr-6">@ clp.is
        </span>
        <div class="float-right">
        <span className = "p-2 ml-10 text-4xl leading-tight tracking-tighter text-gray-100 font-extralight md:text-6xl md:pr-6">
          <span class="opacity-50">you are at my </span> {props.current? props.current : "home"}</span>
        </div>
      </h1>
      </div>
        <div class="bg-gray-50 border-b-2 border-gray-200    rounded-b-lg min-w-full mb-16 md:flex-row  md:mb-12 float-left mr-8">
      <ul className="text-sm">
        <li className="float-left px-10 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          <Link href="/about">home</Link>
        </li>
        <li className="float-left px-10 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          <Link href="/about">about</Link>
        </li>
        <li className="float-left px-10 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          <Link href="/posts">posts</Link>
        </li>
        <li className="float-left px-10 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          <Link href="/contact">contact</Link>
        </li>
        <li className="float-left px-10 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          <Link href="/projects">projects</Link>
        </li>
        <li className="float-left px-10 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          <Link href="/resume">resume</Link>
        </li>
      </ul>

        </div>
      {/* <ul className="space-x-10"> */}
      {/*   <li className="float-left"> */}
      {/*     <Link href="/about">about</Link> */}
      {/*   </li> */}
      {/*   <li className="float-left"> */}
      {/*     <Link href="/posts">posts</Link> */}
      {/*   </li> */}
      {/*   <li className="float-left"> */}
      {/*     <Link href="/contact">contact</Link> */}
      {/*   </li> */}
      {/*   <li className="float-left"> */}
      {/*     <Link href="/projects">projects</Link> */}
      {/*   </li> */}
      {/* </ul> */}
    </div>
    </section>
  )
}
