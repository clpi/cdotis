import Intro from '../components/intro'
import Layout from '../components/layout'
import Image from 'next/image'
import Container from '../components/container'
export default function Projects() {
  return (
    <>
      <Layout>
        <Container>
          <Intro current="projects"/>
          <h1 class="text-4xl font-light">Projects</h1>
          <p>Some things I'm working on...</p>
          <ul>

            <li>
              <div>
                <Image src="/assets/logo_icon_transparent.png" width="300" height="300" class = "float-left"/>
                <p><a href="https://devisa.io" class="text-green-500 font-semibold text-lg">Devisa</a> -- An life tracking/programmatic planning project/startup I'm working on.</p>
              </div>
            </li>
            </ul>
        </Container>
      </Layout>

    </>
  )
}
