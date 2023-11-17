import Link from "next/link"

const PrimaryHeader = () => {
  return (
    <header className="header flex items-center justify-start h-20">
      <ul>
        <li><Link href="/">На головну</Link></li>
      </ul>
    </header>
  )
}

export default PrimaryHeader
