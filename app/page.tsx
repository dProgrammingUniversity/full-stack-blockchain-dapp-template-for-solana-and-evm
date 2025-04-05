import Link from "next/link"
import { ArrowRight, Github, Linkedin, Mail, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SkillCategory } from "@/components/skill-category"
import { createClient } from "@/utils/supabase/server"
import { ProjectsSection } from "@/components/projects-section"
import { ProjectFromDB, Technology, ProjectDisplay } from "@/components/types/database"
import { HelloWeb3World } from "@/components/blockchain/solana/HelloWeb3World"


async function getTechnologyName(id: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('technology')
    .select('name')
    .eq('id', id)
    .single()

  return data?.name || null
}

async function getProjects(): Promise<ProjectDisplay[]> {
  const supabase = createClient()

  // First, get all projects
  const { data: projects, error } = await supabase
    .from('project')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !projects) {
    console.error("Error fetching projects:", error)
    return []
  }

  // Then, for each project, get the technology names
  const formattedProjects = await Promise.all(projects.map(async (project: ProjectFromDB) => {
    const techIds = [
      project.tech_1,
      project.tech_2,
      project.tech_3,
      project.tech_4,
      project.tech_5,
      project.tech_6,
      project.tech_7,
      project.tech_8,
      project.tech_9,
      project.tech_10
    ].filter((id): id is string => Boolean(id))

    const techNames = await Promise.all(
      techIds.map(id => getTechnologyName(id))
    )

    return {
      title: project.title,
      description: project.description,
      technologies: techNames.filter((name): name is string => Boolean(name)),
      liveUrl: project.live_url,
      repoUrl: project.repo_url
    }
  }))

  return formattedProjects
}

export default async function Home() {
  const projects = await getProjects()

  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Full-Stack Web3 Developer
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Building the decentralized future with blockchain technology and modern web development
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="#projects">
                  View Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#contact">Contact Me</Link>
              </Button>
            </div>
          </div>
        </section>
        <section id="about" className="container space-y-6 bg-orange-50 py-8 dark:bg-slate-900 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl md:text-5xl">About Me</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              I'm a passionate full-stack web3/Blockchain developer with 5+ years of experience building decentralized applications
              and blockchain solutions. My journey in web3 began with Ethereum smart contract development and has since
              expanded to include multiple blockchain ecosystems including Solana, Polkadot, and Layer 2 solutions.
            </p>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              With a background in traditional web development and a deep understanding of blockchain technology, I
              bridge the gap between web2 and web3, creating intuitive and powerful decentralized applications that
              solve real-world problems.
            </p>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              I'm constantly learning and exploring new technologies in this rapidly evolving space, and I'm passionate
              about contributing to the growth of the decentralized web.
            </p>
          </div>
        </section>
        <section id="skills" className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl md:text-5xl">Skills</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              My technical expertise spans across the entire web3 development stack
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <SkillCategory
              title="Smart Contract Development"
              skills={["Solidity", "Rust", "EVM", "Solana", "Hardhat", "Truffle", "OpenZeppelin"]}
            />
            <SkillCategory
              title="Frontend Development"
              skills={["React", "Next.js", "TypeScript", "Tailwind CSS", "Web3.js", "ethers.js", "Moralis"]}
            />
            <SkillCategory
              title="Backend Development"
              skills={["Node.js", "Express", "GraphQL", "The Graph", "IPFS", "Ceramic", "Arweave"]}
            />
            <SkillCategory
              title="DeFi & NFTs"
              skills={["Uniswap", "Aave", "Compound", "ERC-20", "ERC-721", "ERC-1155", "Metadata Standards"]}
            />
            <SkillCategory
              title="DevOps & Infrastructure"
              skills={["Docker", "CI/CD", "AWS", "Vercel", "Infura", "Alchemy", "QuickNode"]}
            />
            <SkillCategory
              title="Testing & Security"
              skills={["Mocha", "Chai", "Waffle", "Slither", "Mythril", "Echidna", "Formal Verification"]}
            />
          </div>
        </section>
        <section id="projects" className="container space-y-6 bg-orange-50 py-8 dark:bg-slate-900 md:py-12 lg:py-24">
          <ProjectsSection projects={projects} />
        </section>

        {/* Blockchain Section */}
        <section id="blockchains" className="container space-y-6 bg-orange-50 py-8 dark:bg-slate-900 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl md:text-5xl">
              On-chain Integration Demo
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Experience live blockchain interaction with my deployed smart contracts
            </p>
            <HelloWeb3World />
          </div>
        </section>

        <section id="contact" className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl md:text-5xl">Get in Touch</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Interested in working together? I'd love to hear from you!
            </p>
          </div>
          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Contact Information</h3>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>hello@dprogrammingUniversity.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Twitter className="h-5 w-5 text-muted-foreground" />
                <span>@SolomonFoskaay</span>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="h-5 w-5 text-muted-foreground" />
                <span>github.com/SolomonFoskaay</span>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <span>linkedin.com/in/SolomonFoskaay</span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Send a Message</h3>
              <form className="space-y-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your name"
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your email"
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your message"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

