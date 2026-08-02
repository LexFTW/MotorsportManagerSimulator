export const RaceLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {/* <div style={{ backgroundImage: `url(${TrackBackground})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, filter: 'blur(4px)' }}></div>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
            
            <TrackSvg style={{ filter: 'drop-shadow(10px 10px 6px #222)', position: 'fixed', top: '-294px', left: '-186px', width: '121%', height: '170%', zIndex: 1001, pointerEvents: 'none', transform: 'rotate(50deg)' }} /> */}
            
            {children}
        </>
    )
}