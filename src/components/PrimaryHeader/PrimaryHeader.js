import Link from "next/link"

const PrimaryHeader = () => {
  return (
    <header className="header flex items-center justify-end h-20 p-8">
      <ul>
        <li><Link href="/">Головна</Link></li>
      </ul>
    </header>
  )
}

export default PrimaryHeader
