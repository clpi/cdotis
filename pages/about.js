import Intro from '../components/intro'
import Link from 'next/link'
import Layout from '../components/layout'
import Container from '../components/container'
export default function About() {
  return (
    <>
      <Layout>
        <Container>
          <Intro current="about" />
          <h1>About me</h1>
          <p>I'm a Seattle-area native and University of Washington recent-graduate with a Bachelor's Materials Science & Engineering degree.</p>

          <p>Currently, I'm working primarily on work related to Cloud infrastructure services such as AWS, Microsoft Azure, etc. and on <a href="https://devisa.io">Devisa</a></p>.

          <p>Please <Link href="/contact">reach out to me</Link> if you'd like to talk!</p>
        </Container>
      </Layout>

    </>
  )
}
