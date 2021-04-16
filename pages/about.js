import Link from 'next/link'
import Layout from '../components/layout'
import Container from '../components/container'
import Image from 'next/image'

export default function About() {
  return (
    <>
      <Layout>
        <Container>
      <h2 className="mb-8 text-6xl font-light leading-tight tracking-tighter md:text-7xl">
        About me
      </h2>
          <div class="space-x-7">
            <Image src="/assets/face.jpg" width="300" height="300"
              className="float-left px-10 mx-10 mr-20 rounded-full"/>
            <Image src="/assets/boeing.JPG" width="400" height="300"
              className="float-left ml-20 rounded-full"/>
            <div className="float-right align-middle">
              <p>I'm a Seattle-area native and University of Washington recent-graduate with a Bachelor's Materials Science & Engineering degree.</p>
              <p>Currently, I'm working primarily on work related to Cloud infrastructure services such as AWS, Microsoft Azure, etc. and on <a href="https://devisa.io">Devisa</a> (a LLC startup in very early stages!)</p>.
          <p>Although my attention is currently taken with tech/cloud projects, still a significant part of myself will always lie with the physical sciences in general and materials science in particular -- and to that respect, I have several hobby projects I am currently working on in my free time, and other aspirations which will see fruition down the road.</p>
              <br/>
            </div>
          </div>



          <p>Please <Link href="/contact">reach out to me</Link> if you'd like to talk!</p>
        </Container>
      </Layout>

    </>
  )
}
