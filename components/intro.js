import Link from 'next/link'

export default function Intro( props ) {
  return (
    <section className="flex flex-col items-center mt-16 mb-16 md:flex-row md:justify-between md:mb-12">
      <h1 className="text-6xl font-light leading-tight tracking-tighter text-gray-800 md:text-8xl md:pr-8">
        <Link href="/">
        clp.is
        </Link>
        <span className = "ml-10 text-4xl leading-tight tracking-tighter text-gray-400 font-extralight md:text-6xl md:pr-6">
          {props.current}
        </span>
      </h1>
      <ul className="space-x-10">
        <li className="float-left">
          <Link href="/about">about</Link>
        </li>
        <li className="float-left">
          <Link href="/posts">posts</Link>
        </li>
        <li className="float-left">
          <Link href="/contact">contact</Link>
        </li>
        <li className="float-left">
          <Link href="/projects">projects</Link>
        </li>
      </ul>
    </section>
  )
}
