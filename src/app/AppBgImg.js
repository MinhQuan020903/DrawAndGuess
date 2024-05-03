import Image from "next/image";

export default function AppBgImg() {
    return <Image
        alt="Background Image"
        src={'/bg.webp'}
        // placeholder="blur"
        fill
        sizes="100vw"
        style={{
            objectFit: 'cover',
            zIndex: -1
        }}
    />
}