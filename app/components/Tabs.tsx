import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from '@remix-run/react'
import './tabs.css'

export function cx(
  ...classNames: Array<string | number | boolean | undefined | null>
) {
  return classNames.filter(Boolean).join(' ')
}

export type TabProps = {
  children: React.ReactNode
  title: string
}

const getTabId = (index: number, suffix?: string) =>
  [`tab-${index}`, suffix].filter(Boolean).join('-')

export function Tab({ children }: TabProps) {
  return <>{children}</>
}

export function Tabs({ children }) {
  const location = useLocation()
  const initialTab = location.hash === '#gbh' ? 1 : 0
  const firstRender = useRef(true)
  const [currentTab, setCurrentTab] = useState(initialTab)
  const tabsRefs = useRef<HTMLElement[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!firstRender.current && tabsRefs.current) {
      tabsRefs.current[currentTab].focus()
    }
  }, [currentTab])

  useEffect(() => {
    firstRender.current = false
  }, [])

  useEffect(() => {
    console.log('location.hash', location.hash)
    const index = location.hash === '#gbh' ? 1 : 0
    if (index !== currentTab) {
      setCurrentTab(index)
    }
  }, [location.hash])

  const onKeyDown = ({ key }: React.KeyboardEvent) => {
    if (key === 'ArrowLeft') {
      setCurrentTab(Math.max(0, currentTab - 1))
    } else if (key === 'ArrowRight') {
      setCurrentTab(
        Math.min(currentTab + 1, React.Children.count(children) - 1)
      )
    }
  }

  const handleTabChange = (index) => {
    console.log('handleTabChange', index, location)
    setCurrentTab(index)
    navigate(`${window.location.search}#${['ov', 'gbh'][index]}`)
  }

  return (
    <div className='Tabs'>
      <div role='tablist' className='Tabs-header'>
        {React.Children.map<React.ReactChild, React.ReactElement<TabProps>>(
          children,
          (child, index) => {
            const isSelected = currentTab === index
            return (
              <button
                role='tab'
                aria-selected={isSelected}
                aria-controls={getTabId(index, 'item')}
                id={getTabId(index, 'title')}
                tabIndex={isSelected ? 0 : -1}
                className={cx('Tabs-title', isSelected && 'Tabs-title--active')}
                ref={(element) => (tabsRefs.current[index] = element!)}
                key={getTabId(index)}
                onClick={handleTabChange.bind(null, index)}
                onKeyDown={onKeyDown}>
                {child.props.title}
              </button>
            )
          }
        )}
      </div>
      <div className='Tabs-list'>
        {React.Children.map(children, (child, index) => (
          <div
            tabIndex={0}
            role='tabpanel'
            id={getTabId(index, 'item')}
            aria-labelledby={getTabId(index, 'title')}
            hidden={currentTab !== index}
            key={getTabId(index)}>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
