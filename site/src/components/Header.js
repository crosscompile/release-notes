import VisuallyHidden from '@reach/visually-hidden'
import { Link } from 'gatsby'
import { Close } from 'icons/Close'
import { ExternalLink } from 'icons/ExternalLink'
import React from 'react'
import { onClose } from '../providers/WidgetProvider'
import { theme } from '../styles/theme'
import { AnchorButton } from './Button/AnchorButton'
import { Button } from './Button/Button'

export const Header = ({
  primaryColor: [red, green, blue],
  setSearchValue,
  logoSrc,
  homepage,
  htmlUrl,
  searchValue,
  isWidget,
}) => (
  <header
    css={{
      position: 'fixed',
      background: `rgb(${red}, ${green}, ${blue})`,
      color: 'white',
      width: '100%',
      zIndex: 1,
      height: 54,
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 1px 6px 0 rgba(32,33,36,0.28)',
    }}
  >
    <div
      css={{
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 0.5rem',
      }}
    >
      {logoSrc && !isWidget && (
        <Link to="/" css={{ flexShrink: 0 }}>
          <img
            src={logoSrc}
            alt=""
            css={{
              display: 'block',
              borderRadius: 3,
              margin: 0,
              background: '#f7f7f7',
              height: 34,
              width: 34,
              border: '2px solid #f7f7f7',
            }}
          />
        </Link>
      )}
      <div
        css={{
          background: 'white',
          borderRadius: 34,
          flexGrow: 1,
          marginLeft: '0.5rem',
          position: 'relative',
        }}
      >
        <input
          placeholder="Search"
          css={{
            width: '100%',
            background: !!searchValue
              ? `rgba(${red}, ${green}, ${blue}, 0.1)`
              : `rgba(${red}, ${green}, ${blue}, 0.9)`,
            border: '1px solid transparent',
            borderRadius: '4px',
            padding: '0.25rem 2rem 0.25rem 0.75rem',
            WebkitAppearance: 'none',
            '::placeholder': {
              color: 'white',
            },
            // @todo improve performance by animating opacity
            transition: 'background 100ms ease-in, color 100ms 50ms linear',
            ':focus': {
              background: `rgb(${red}, ${green}, ${blue}, 0.1)`,
              '::placeholder': {
                color: 'inherit',
              },
            },
          }}
          value={searchValue}
          onChange={({ target: { value } }) => setSearchValue(value)}
        />
        {searchValue && (
          <Button
            onClick={() => setSearchValue('')}
            css={{
              position: 'absolute',
              marginRight: '0.25rem',
              borderRadius: '50%',
              padding: '0.25rem',
              right: 0,
              ':hover': {
                background: 'initial',
              },
            }}
          >
            <Close css={{ color: theme.color.accent, width: 22, height: 22 }} />
            <VisuallyHidden>Clear search</VisuallyHidden>
          </Button>
        )}
      </div>

      {isWidget ? (
        <Button
          onClick={onClose}
          css={{
            marginLeft: '0.5rem',
            padding: '0.25rem',
          }}
        >
          <Close />
          <VisuallyHidden>Close</VisuallyHidden>
        </Button>
      ) : (
        <AnchorButton
          href={homepage || htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          css={{ marginLeft: '0.5rem' }}
        >
          {homepage ? 'Homepage' : 'Github'}
          <ExternalLink
            css={{
              marginLeft: '0.25rem',
              height: '1.2rem',
              width: '1.2rem',
              flexShrink: 0,
            }}
          />
        </AnchorButton>
      )}
    </div>
  </header>
)
