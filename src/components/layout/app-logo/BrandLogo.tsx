type TBrandLogoProps = {
    width?: number;
    height?: number;
    fill?: string;
    className?: string;
    isMobile?: boolean;
};

export const BrandLogo = ({
    width = 120,
    height = 32,
    fill = '#ff003c',
    className = '',
    isMobile = false,
    theme = 'dark',
}: TBrandLogoProps & { theme?: 'light' | 'dark' }) => {
    // Elegant neon red theme color
    const brandColor = fill === '#6366f1' ? '#ff003c' : fill;
    return (
         <div
             className={`brand-logo ${className}`}
             style={{
                 display: 'flex',
                 alignItems: 'center',
                 gap: isMobile ? '6px' : '10px',
                 fontWeight: 800,
                 fontSize: isMobile ? '14px' : '22px',
                 color: brandColor,
                 letterSpacing: '-0.03em',
                 fontFamily: '"Outfit", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
             }}
         >
             <div
                 style={{
                     width: isMobile ? '24px' : '34px',
                     height: isMobile ? '24px' : '34px',
                     background: 'linear-gradient(135deg, #ff003c 0%, #990024 100%)', // Cyber neon red gradient
                     borderRadius: '6px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     color: '#ffffff',
                     fontSize: isMobile ? '12px' : '19px',
                     fontWeight: 900,
                     boxShadow: '0 4px 12px rgba(255, 0, 60, 0.35)',
                     textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                     flexShrink: 0,
                 }}
             >
                 D
             </div>
             <span style={{ fontWeight: 900, letterSpacing: '-0.02em', color: brandColor }} className="brand-logo-title-text">
                 Dtraderdbot
             </span>
         </div>
     );
};
