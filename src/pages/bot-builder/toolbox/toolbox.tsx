import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import Text from '@/components/shared_ui/text';
import { useStore } from '@/hooks/useStore';
import { LabelPairedChevronDownMdFillIcon } from '@deriv/quill-icons/LabelPaired';
import { localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import SearchBox from './search-box';
import { ToolboxItems } from './toolbox-items';
import './toolbox.scss';

const Toolbox = observer(() => {
    const { isDesktop } = useDevice();
    const { toolbox, flyout } = useStore();
    const {
        hasSubCategory,
        is_search_loading,
        onMount,
        onSearchBlur,
        onSearchClear,
        onSearchKeyUp,
        onToolboxItemClick,
        onToolboxItemExpand,
        onUnmount,
        sub_category_index,
        toolbox_dom,
    } = toolbox;
    const { setVisibility, selected_category } = flyout;

    const toolbox_ref = React.useRef(ToolboxItems());
    const [is_open, setOpen] = React.useState(true);
    const [pending_selection] = React.useState<string | null>(null);

    React.useEffect(() => {
        onMount(toolbox_ref);
        return () => onUnmount();
    }, []);

    return (
        <div className={classNames('db-toolbox', { 'db-toolbox--mobile': !isDesktop })} data-testid='dashboard__toolbox'>
            <div className='db-toolbox__header'>
                <div
                    className='db-toolbox__title'
                    data-testid='db-toolbox__title'
                    onClick={() => {
                        setOpen(!is_open);
                        setVisibility(false);
                    }}
                >
                    <Text weight='bold' size={isDesktop ? 's' : 'xs'}>
                        {localize('Blocks menu')}
                    </Text>
                    <span
                        className={classNames('db-toolbox__title__chevron', {
                            'db-toolbox__title__chevron--active': is_open,
                        })}
                    >
                        <LabelPairedChevronDownMdFillIcon fill='var(--text-general)' />
                    </span>
                </div>
            </div>

            <div className={classNames('db-toolbox__content-wrapper', { active: is_open })}>
                <SearchBox
                    is_search_loading={is_search_loading}
                    onSearch={toolbox.onSearch}
                    onSearchBlur={onSearchBlur}
                    onSearchClear={onSearchClear}
                    onSearchKeyUp={onSearchKeyUp}
                />
                <div className='db-toolbox__category-menu'>
                    {toolbox_dom &&
                        Array.from(toolbox_dom.childNodes)
                            .map(node => node as HTMLElement)
                            .map((category, index) => {
                                if (category.tagName.toUpperCase() === 'CATEGORY') {
                                    const has_sub_category = hasSubCategory(category.children);
                                    const is_sub_category_open = sub_category_index.includes(index);
                                    return (
                                        <div
                                            key={`db-toolbox__row--${category.getAttribute('id')}`}
                                            className={classNames('db-toolbox__row', {
                                                'db-toolbox__row--active':
                                                    selected_category?.getAttribute('id') === category?.id,
                                                'db-toolbox__row--pending':
                                                    pending_selection === category?.getAttribute('id'),
                                            })}
                                        >
                                            <div
                                                className='db-toolbox__item'
                                                onClick={() => {
                                                    has_sub_category
                                                        ? onToolboxItemExpand(index)
                                                        : onToolboxItemClick(category);
                                                }}
                                            >
                                                <div className='db-toolbox__category-text'>
                                                    <div className='db-toolbox__label'>
                                                        {localize(category.getAttribute('name') as string)}
                                                    </div>
                                                    {has_sub_category && (
                                                        <div
                                                            className={classNames('db-toolbox__category-arrow', {
                                                                'db-toolbox__category-arrow--active':
                                                                    is_sub_category_open,
                                                            })}
                                                        >
                                                            <LabelPairedChevronDownMdFillIcon fill='var(--text-general)' />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {has_sub_category &&
                                                is_sub_category_open &&
                                                Array.from(category.childNodes)
                                                    .map(node => node as HTMLElement)
                                                    .map(subCategory => (
                                                        <div
                                                            key={`db-toolbox__sub-category-row--${subCategory.getAttribute('id')}`}
                                                            className={classNames('db-toolbox__sub-category-row', {
                                                                'db-toolbox__sub-category-row--active':
                                                                    selected_category?.getAttribute('id') === subCategory?.id,
                                                            })}
                                                            onClick={() => onToolboxItemClick(subCategory)}
                                                        >
                                                            <Text size='xxs'>
                                                                {subCategory.getAttribute('name') as string}
                                                            </Text>
                                                        </div>
                                                    ))}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                </div>
            </div>

            {/* Blockly toolbox will be injected here if needed, but we use our own menu */}
            <div style={{ display: 'none' }} id='gtm-toolbox' />
        </div>
    );
});

export default Toolbox;
