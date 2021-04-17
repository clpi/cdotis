import Link from 'next/link'
import Layout from '../../components/layout'
import Head from 'next/head';
import Container from '../../components/container'
import Image from 'next/image'

export default function About() {
  return (
    <>
      <Head>
        <title>about - clp.is chris pecunies</title>
      </Head>
      <Layout current="about">
        <Container>
          <div class="inline-block mb-0 mt-5 grid grid-cols-2">
            <div class="float-left mr-8">
      <h2 className="mb-8 text-6xl font-light leading-tight tracking-tighter">
        about me
      </h2>
            </div>
            <div class="ml-24 float-right text-sm">
          <a href="mailto:clp@clp.is"><button class="px-5 py-3 rounded-lg shadow bg-green-500 text-white mr-4">Contact me</button></a>

          <a href="mailto:chris@devisa.io"><button class="px-5 py-3 rounded-lg shadow bg-white-500 text-black">Schedule me</button></a>
            </div>
          </div>
          <div class="border-l-4 border-green-300 pl-8">
            <div>
            <Image src="/assets/face.jpg" width="300" height="300"
              className="float-left px-10 mx-10 mr-20 rounded-full"/>
            <Image src="/assets/boeing.JPG" width="400" height="300"
              className="float-left ml-20 rounded-full"/>
              <br/><br/>
            <div className="float-right align-middle">
              <p>I'm a Seattle-area native and University of Washington recent-graduate with a Bachelor's Materials Science & Engineering degree.</p>
              <p>Currently, I'm working primarily on work related to Cloud infrastructure services such as AWS, Microsoft Azure, etc. and on <a href="https://devisa.io">Devisa</a> (a LLC startup in very early stages!)</p>.
              <br/><br/>
          <p>Although my attention is currently taken with tech/cloud projects, still a significant part of myself will always lie with the physical sciences in general and materials science in particular -- and to that respect, I have several hobby projects I am currently working on in my free time, and other aspirations which will see fruition down the road.</p>
              <br/>
            </div>
          </div>



          <p>Please <Link href="/contact">reach out to me</Link> if you'd like to talk!</p>
          </div>
        </Container>
      </Layout>

    </>
  )
}
