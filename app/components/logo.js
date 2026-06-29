import Link from "next/link";

const Logo = () => {
    return (
        <Link href="/">
            <div className="flex flex-row items-center gap-2 absolute top-5 left-5">
                <img src="https://jackie-jeans.vercel.app/monogram.svg" alt="logo" className="w-12 h-12" />
                <p className="text-2xl font-bold">Jackie Jeans</p>
            </div>
        </Link>
    )
}

export default Logo