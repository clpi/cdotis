import Layout from '../../components/layout'
import Head from 'next/head';
import Image from 'next/image'
import Container from '../../components/container'
export default function Projects() {
  return (
    <>
      <Head>
        <title>projects - clp.is chris pecunies</title>
      </Head>
      <Layout current="projects">
        <Container>
          <div class="inline-block mb-0 mt-5 grid grid-cols-2">
            <div class="float-left mr-8">
      <h2 className="mb-8 text-6xl font-light leading-tight tracking-tighter">
        my projects
      </h2>
            </div>
            <div class="ml-24 float-right text-sm">
          <a href="mailto:clp@clp.is"><button class="px-5 py-3 rounded-lg shadow bg-green-500 text-white mr-4">Contact me</button></a>

          <a href="mailto:chris@devisa.io"><button class="px-5 py-3 rounded-lg shadow bg-white-500 text-black">Schedule me</button></a>
            </div>
          </div>
          <div class="border-l-4 border-green-300 pl-8">
      <h2 className="mb-8 text-lg font-light leading-tight tracking-tighter md:text-4xl">
        <span class="text-green-500 font-semibold">1. </span>Devisa
      </h2>

        <b>Life data automation</b> and centralization dashboard of the future. <a class="text-green-500 font-bold" href="https://devisa.io">Lookie here.</a> This is what I'm spending most of my time on these days (as of April 2021). I'm intending to go all the way with what I consider to be one of my more cohesive visions for a project generally, and a piece of software in particular. It's ambitious -- not in the manner in which I might come across as tooting my own horn, but rather, it's ambitious and a little bit frightening to think of myself seeing a full multi-tiered project out to completion on my own, but so far it's showing quite a bit of promise.

      <br/><br/>
        <p>In the process of developing Devisa over the last month or two (again, as of April 2021) I have learned much more than I ever would have thought possible in so short a time about systems architecture, engineering, and all that more abstract jazz, but I've also come to appreciate the zen-like machinery of working away at Flutter layouts and various JavaScript frontend peculariarities that I am inevitably exposed to working on all levels of such a large and unwieldy project. </p>
                <Image src="/assets/logo_icon_transparent.png" width="300" height="300" class = "float-left"/>
      <br/><br/>
      <p>Resources related to Devisa:</p>
      <ul class="ml-0 border-l-4 border-yellow-200 pl-8">
        <li>1. <a class="text-green-500" href="https://docs.devisa.io">Devisa documentation</a></li>
        <li>2. <a class="text-green-500" href="https://book.devisa.io">Devisa book</a></li>
        <li>3. <a class="text-green-500" href="https://dlog.div.is">Dlog</a></li>
        <li>4. <a class="text-green-500" href="https://blog.devisa.io">Devisa promo blog</a></li>
        <li>5. <a class="text-green-500" href="https://devisa.io/blog">Devisa dev blog</a></li>
        <li>6. <a class="text-green-500" href="https://devisa.io/shop">Devisa shop</a></li>
        <li>7. <a class="text-green-500" href="https://dvsa.io">Devisa tech home</a></li>
        <li>8. <a class="text-green-500" href="https://github.com/devisa">GitHub Devisa Organization</a></li>
      </ul>
              </div>
          <div class="border-l-4 border-blue-300 pl-8 mt-8">
      <h2 className="mb-8 text-lg font-light leading-tight tracking-tighter md:text-4xl">
        <span class="text-blue-500 font-semibold">2. </span>Idlets Inc.
      </h2>

        <b>More info forthcoming...</b> check back later!
                <Image src="/assets/icon2.png" width="300" height="300" class = "float-left"/>
      <br/><br/>
      <p>Resources related to Idlets:</p>
      <ul class="ml-0 border-l-4 border-yellow-200 pl-8">
        <li>1. <a class="text-green-500" href="https://idlets.com">Idlets website</a></li>
        <li>2. <a class="text-green-500" href="https://blog.idlets.com">Idlets blog</a></li>
      </ul>

  </div>
          <div class="border-l-4 border-red-300 pl-8 mt-8">
      <h2 className="mb-8 text-lg font-light leading-tight tracking-tighter md:text-4xl">
        <span class="text-red-500 font-semibold">3. </span>Iridel / VTRL.
      </h2><b>More info forthcoming...</b> check back later!
            <ul>
              <li><a class="text-indigo-500" href="https://vtrl.us">vtrl</a></li>
              <li><a class="text-purple-500" href="https://mtrl.us">vtrl</a></li>
              <li><a class="text-blue-500" href="https://iridel.us">iridel</a></li>
            </ul>
  </div>
        </Container>
      </Layout>

    </>
  )
}
