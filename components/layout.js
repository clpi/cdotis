import Link from 'next/link';
import { Router } from 'next/router';
import Alert from '../components/alert'
import Footer from '../components/footer'
import Meta from '../components/meta'

export default function Layout(props) {
  return (
    <div class=" overflow-x-hidden bg-gradient-to-br from-gray-100 pt-8 to-gray-50 min-h-screen min-h-full h-full overflow-y-visible block pb-24">
      <Meta />
    <section className="items-center w-2/3 mx-auto mb-2 md:flex-row md:justify-between bg-gray-50">
    <div class="rounded-lg shadow">
      <div className="px-4 py-1 border-t border-green-500 rounded-t-lg bg-gradient-to-b from-green-400 to-green-300 opacity-90">
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
        <div class="bg-gray-50 border-b-2 border-gray-200    rounded-b-lg min-w-full  md:flex-row   float-left mr-8">
      <ul className="text-sm">
        <li className="float-left px-10 py-4 hover:bg-gray-200 hover:border-black hover:border-b-2transition-all duration-100">
          <Link href="/">home</Link>
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
          <div class="float-right">
            <input placeholder="Search..." class=" border-b-2 rounded-md shadow-xs border-gray-200 mt-3 mx-4 py-1 px-3 mr-4"/>
          </div>

        </div>
    </div>
    </section>
      <br/>
      <br/>
      <br/>
      <br/>
      <div class="w-2/3 mx-auto  px-32 py-6 bg-white rounded-xl shadow">
        <main>{props.children}</main>
      </div>
      {/* <Footer /> */}
    </div>
  )
}
