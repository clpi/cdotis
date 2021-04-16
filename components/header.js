import Link from 'next/link'

export default function Header() {
  return (
    <h2 className="mt-8 mb-20 text-2xl leading-tight tracking-tight font-extralight md:text-4xl md:tracking-tighter">
      <Link href="/">
        <a className="hover:underline">clp.is</a>
      </Link>
    </h2>
  )
}
