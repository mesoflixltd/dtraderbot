import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '@/components/error-component/error-boundary';
import ErrorComponent from '@/components/error-component/error-component';
import ChunkLoader from '@/components/loader/chunk-loader';
import AmazingLoader from '@/components/loader/amazing-loader';
import { api_base } from '@/external/bot-skeleton';
import { useStore } from '@/hooks/useStore';
import { localize } from '@deriv-com/translations';
import { AnimatePresence, motion } from 'framer-motion';
import './app-root.scss';

const AppContent = lazy(() => import('./app-content'));

const AppRootLoader = () => {
    return <ChunkLoader message={localize('Initializing Command Centre...')} />;
};

const ErrorComponentWrapper = observer(() => {
    const { common } = useStore();

    if (!common.error) return null;

    return (
        <ErrorComponent
            header={common.error?.header}
            message={common.error?.message}
            redirect_label={common.error?.redirect_label}
            redirectOnClick={common.error?.redirectOnClick}
            should_clear_error_on_click={common.error?.should_clear_error_on_click}
            setError={common.setError}
            redirect_to={common.error?.redirect_to}
            should_redirect={common.error?.should_redirect}
        />
    );
});

const AppRoot = () => {
    const store = useStore();
    const api_base_initialized = useRef(false);
    const [is_api_initialized, setIsApiInitialized] = useState(false);
    const [show_tech_animation, setShowTechAnimation] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTechAnimation(false);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    // Initialize API
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!is_api_initialized) {
                setIsApiInitialized(true);
            }
        }, 8000); // Extended timeout to allow animation to breathe

        const initializeApi = async () => {
            if (!api_base_initialized.current) {
                try {
                    await api_base.init();
                    api_base_initialized.current = true;
                } catch (error) {
                    console.error('API initialization failed:', error);
                    api_base_initialized.current = false;
                } finally {
                    setIsApiInitialized(true);
                    clearTimeout(timeoutId); // Clear timeout if API init completes
                }
            }
        };

        initializeApi();
        return () => clearTimeout(timeoutId);
    }, []);

    if (!store) return <AppRootLoader />;

    return (
        <Suspense fallback={<AppRootLoader />}>
            <AnimatePresence>
                {show_tech_animation && (
                    <motion.div 
                        initial={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 0.5 }}
                        className="app-root__fullscreen-loader"
                        style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0e0e0e' }}
                    >
                        <AmazingLoader 
                            message={localize('Initializing Command Centre...')} 
                            onSkip={() => {
                                setShowTechAnimation(false);
                                if (!is_api_initialized) {
                                    setIsApiInitialized(true);
                                }
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {!show_tech_animation && (
                <ErrorBoundary root_store={store}>
                    <ErrorComponentWrapper />
                    {!is_api_initialized ? <AppRootLoader /> : <AppContent />}
                </ErrorBoundary>
            )}
        </Suspense>
    );
};

export default AppRoot;
