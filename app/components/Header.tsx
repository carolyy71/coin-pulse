'use client'
import Image from 'next/image'
import Link from 'next/link'


const Header = () => {
    return (
        <header>
            <div className='main-conatiner inner'>
                <Link href={"/"}>
                    <Image src={"/logo.svg"} alt='coin pluse logo' width={132} height={40} />
                </Link>
                <nav>
                    <Link href={"/"}>Home</Link>
                    <p>search modal</p>
                    <Link href={"/coin"}>Coin</Link>
                </nav>
            </div>
        </header>
    )
}

export default Header