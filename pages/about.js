import Intro from '../components/intro'
import Link from 'next/link'
import Layout from '../components/layout'
import Container from '../components/container'
import Image from 'next/image'

export default function About() {
  return (
    <>
      <Layout>
        <Container>
          <Intro current="about" />
          <h1 class="text-4xl mb-8">About me</h1>
          <div>
            <Image src="/assets/face.jpg" width="300" height="300"
              className="float-left rounded-full"/>
            <div className="float-right align-middle">
              <p>I'm a Seattle-area native and University of Washington recent-graduate with a Bachelor's Materials Science & Engineering degree.</p>
              <br/>
            </div>
          </div>


          <Image src="/assets/boeing.JPG" width="400" height="300"
            className="float-right rounded-full"/>
              <p>Currently, I'm working primarily on work related to Cloud infrastructure services such as AWS, Microsoft Azure, etc. and on <a href="https://devisa.io">Devisa</a> (a LLC startup in very early stages!)</p>.

          <p>Please <Link href="/contact">reach out to me</Link> if you'd like to talk!</p>
        </Container>
      </Layout>

    </>
  )
}
