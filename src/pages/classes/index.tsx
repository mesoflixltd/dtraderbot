import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hooks/useStore';
import { load } from '@/external/bot-skeleton';
import { localize } from '@deriv-com/translations';
import { DBOT_TABS } from '@/constants/bot-contents';
import { LabelPairedPlayCaptionBoldIcon } from '@deriv/quill-icons/LabelPaired';
import './classes.scss';

const CLASSES_DATA = [
    {
        id: '1',
        title: 'How to Load and Use Mesoflix Bots',
        description: 'Watch this quick tutorial to understand how to load our premium bots and start your trading journey. This example uses the Wizard Strategy bot.',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example video
        botName: 'Deriv wizard 1', // This matches public/bots/Deriv wizard 1.xml
    },
];

const Classes = observer(() => {
    const { dashboard, ui } = useStore();
    const { setActiveTab } = dashboard;

    const handleLoadBot = async (botName: string) => {
        try {
            const response = await fetch(`/bots/${encodeURIComponent(botName)}.xml`);
            if (!response.ok) {
                throw new Error('Bot file not found');
            }
            const xmlText = await response.text();
            
            // Switch to Bot Builder tab first
            setActiveTab(DBOT_TABS.BOT_BUILDER);

            // Load the bot into the workspace
            // We use a small timeout to ensure the workspace is ready if it wasn't active
            setTimeout(async () => {
                await load({
                    block_string: xmlText,
                    file_name: botName,
                    workspace: window.Blockly.derivWorkspace,
                    from: 'local',
                    drop_event: null,
                    strategy_id: null,
                    showIncompatibleStrategyDialog: false,
                });
                
                // Show success message if needed (optional)
                console.log(`Bot ${botName} loaded successfully`);
            }, 100);

        } catch (error) {
            console.error('Failed to load bot:', error);
            // You might want to show a notification to the user here
        }
    };

    return (
        <div className='classes-page'>
            <div className='classes-header'>
                <h1>{localize('Mesoflix Classes')}</h1>
                <p>{localize('Watch and learn how to use our elite trading bots. Master the strategies and start trading like a pro.')}</p>
            </div>

            <div className='classes-grid'>
                {CLASSES_DATA.map((item) => (
                    <div key={item.id} className='class-card'>
                        <div className='video-container'>
                            <iframe
                                src={item.youtubeUrl}
                                title={item.title}
                                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                allowFullScreen
                            />
                        </div>
                        <div className='class-info'>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <button 
                                className='bot-button' 
                                onClick={() => handleLoadBot(item.botName)}
                            >
                                <LabelPairedPlayCaptionBoldIcon />
                                {localize('Load {{botName}}', { botName: item.botName })}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Classes;
