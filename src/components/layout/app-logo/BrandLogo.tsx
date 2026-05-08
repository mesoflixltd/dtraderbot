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
    fill = '#6366f1',
    className = '',
    isMobile = false,
}: TBrandLogoProps) => {
    return (
        <div
            className={`brand-logo ${className}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: isMobile ? '20px' : '22px',
                color: fill,
                letterSpacing: '-0.02em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            <div
                style={{
                    width: isMobile ? '28px' : '32px',
                    height: isMobile ? '28px' : '32px',
                    background: fill,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 900,
                }}
            >
                O
            </div>
            <span>{isMobile ? 'Osam' : 'OsamTradingHub'}</span>
        </div>
    );
};
