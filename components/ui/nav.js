import Link from 'next/link';
import { Router } from 'next/router';
import Alert from '../alert'
import Footer from '../footer'
import Meta from '../meta'

export default function Nav(props) {
  return (
    <section className="sticky items-center w-full mx-auto mb-0 md:flex-row md:justify-between bg-gray-50">
    <div class="rounded-lg shadow sticky">
      <div className="px-4 py-1 border-t border-green-500 bg-gradient-to-b from-green-400 to-green-300 opacity-90 pl-72 pr-72">
      <h1 className="pb-0 text-2xl leading-tight tracking-tighter text-gray-800 pt-28 font-extralight md:text-5xl md:pr-8">
        <Link href="/">
          <span class="ml-8 text-white opacity-60">chris</span>
        </Link>
        <span className = "ml-4 text-lg leading-tight tracking-tighter text-white opacity-90 font-extralight md:text-6xl md:pr-6">@ clp.is
        </span>
        <div class="float-right">
        <span className = "p-2 ml-10 text-4xl leading-tight tracking-tighter text-gray-100 font-extralight md:text-6xl md:pr-6">
          <span class="opacity-50">you are at my </span> {props.current? props.current : "home"}</span>
        </div>
      </h1>
      </div>
        <div class="bg-gray-50 border-b-2 border-gray-200    rounded-b-lg min-w-full  md:flex-row   float-left mr-8 pl-72 pr-72">
      <ul className="text-sm">
        <Link href="/"><li className="float-left px-6 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          <Link href="/"> home </Link>
        </li></Link>
        <Link href="/about"><li className="float-left px-6 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          about
        </li></Link>
        <Link href="/posts"><li className="float-left px-6 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          posts
        </li></Link>
        <Link href="/contact"><li className="float-left px-6 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          contact
        </li></Link>
        <Link href="/projects"><li className="float-left px-6 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          projects
        </li></Link>
        <Link href="/resume"><li className="float-left px-6 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          <Link href="/resume">resume</Link>
        </li></Link>
        <Link href="/resources"><li className="float-left px-6 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          links
        </li></Link>
        {/* <li className="float-left px-6 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100"> */}
        {/*   <Link href="/resources">resources</Link> */}
        {/* </li> */}
      </ul>
          <div class="float-right">
            <input placeholder="Search..." class=" border-b-2 rounded-md  border-gray-300 shadow mt-3 mx-4 py-1 px-3 mr-4 transition duration-200 bg:gray-100 focus:outline-none focus:ring-2 ring-green-400 hover:shadow-sm"/>
            <a href="#"><button class="px-3 border-b-2 border-gray-300 py-1 text-gray-700 rounded-lg shadow bg-white text-black mr-8 hover:bg-gray-100 transition duration-200 hover:shadow-sm hover:border-gray-400">Go</button></a>
          </div>

        </div>
    </div>
    </section>
  );
}
