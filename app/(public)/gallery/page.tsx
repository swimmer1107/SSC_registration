// app/(public)/gallery/page.tsx
import { prisma } from '@/lib/prisma'

const PER_PAGE = 12

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const { category, page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10))

  const where = {
    isActive: true,
    ...(category && category !== 'all' ? { category: category.toLowerCase() } : {}),
  }

  const [totalImages, images] = await Promise.all([
    prisma.galleryImage.count({ where }),
    prisma.galleryImage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalImages / PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)

  const CATEGORIES = [
    { key: 'all', label: 'ALL' },
    { key: 'sports', label: 'SPORTS' },
    { key: 'cultural', label: 'CULTURAL' },
    { key: 'events', label: 'EVENTS' },
    { key: 'workshops', label: 'WORKSHOPS' },
    { key: 'team', label: 'TEAM' },
  ]

  function makeHref(cat?: string, pg?: number) {
    const params = new URLSearchParams()
    if (cat && cat !== 'all') params.set('category', cat)
    if (pg && pg > 1) params.set('page', String(pg))
    const qs = params.toString()
    return `/gallery${qs ? `?${qs}` : ''}`
  }

  const activeCategory = category && category !== 'all' ? category : 'all'

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        .gallery-card {
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .gallery-card:hover {
          transform: translateY(-8px) !important;
          border-color: rgba(76,175,80,0.55) !important;
          box-shadow: 0 20px 56px rgba(76,175,80,0.18) !important;
        }
        .gallery-card:hover .card-overlay {
          opacity: 1 !important;
        }
        .cat-btn {
          transition: all 0.25s ease;
        }
        .cat-btn:hover {
          background: rgba(76,175,80,0.22) !important;
          border-color: rgba(76,175,80,0.55) !important;
          color: #81C784 !important;
        }
        .page-btn {
          transition: all 0.2s ease;
        }
        .page-btn:hover {
          background: rgba(76,175,80,0.22) !important;
          border-color: rgba(76,175,80,0.5) !important;
          color: #4CAF50 !important;
        }
      `}</style>

      <div style={{ background: '#030A03', minHeight: '100vh' }}>

        {/* ── Hero Section with Video Background ── */}
        <section style={{
          position: 'relative',
          height: '62vh',
          minHeight: '380px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(76,175,80,0.2)',
        }}>
          {/* Video background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              animation: 'heroFadeIn 1.2s ease both',
            }}
          >
            <source src="/videos/gallery-hero.mp4" type="video/mp4" />
          </video>

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: [
              'linear-gradient(to bottom, rgba(3,10,3,0.45) 0%, rgba(3,10,3,0.7) 100%)',
              'linear-gradient(135deg, rgba(27,94,32,0.55) 0%, rgba(3,10,3,0.85) 60%)',
            ].join(', '),
            zIndex: 1,
          }} />

          {/* Fallback gradient when video absent */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(27,94,32,0.35) 0%, transparent 70%)',
            zIndex: 1,
          }} />

          {/* Hero content */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: '0 24px',
          }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              color: '#4CAF50',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              SSC · AAGAAZ
            </p>

            <h1 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(4rem, 11vw, 8rem)',
              color: 'white',
              letterSpacing: '0.12em',
              lineHeight: 0.9,
              margin: '0 0 24px',
              textShadow: '0 6px 40px rgba(0,0,0,0.7)',
            }}>
              GALLERY
            </h1>

            {/* Glowing bar */}
            <div style={{
              width: '100px',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #4CAF50, transparent)',
              margin: '0 auto 20px',
              boxShadow: '0 0 24px rgba(76,175,80,0.7)',
            }} />

            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(14px, 2.2vw, 19px)',
              color: 'rgba(165,214,167,0.85)',
              letterSpacing: '0.12em',
            }}>
              Moments that define AAGAAZ
            </p>

            {/* Live image count */}
            <div style={{
              marginTop: '28px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '999px',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(76,175,80,0.25)',
            }}>
              <span style={{ color: '#4CAF50', fontSize: '13px' }}>📸</span>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgba(165,214,167,0.8)',
              }}>
                {totalImages} photo{totalImages !== 1 ? 's' : ''} in collection
              </span>
            </div>
          </div>
        </section>

        {/* ── Filters + Grid ── */}
        <section style={{ padding: '56px 24px 80px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

            {/* Category tabs */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '56px',
            }}>
              {CATEGORIES.map(({ key, label }) => {
                const isActive = activeCategory === key
                return (
                  <a
                    key={key}
                    href={makeHref(key)}
                    className="cat-btn"
                    style={{
                      padding: '12px 28px',
                      borderRadius: '999px',
                      background: isActive
                        ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)'
                        : 'rgba(27,94,32,0.12)',
                      border: `1px solid ${isActive ? 'transparent' : 'rgba(76,175,80,0.28)'}`,
                      color: isActive ? '#000' : 'rgba(165,214,167,0.85)',
                      textDecoration: 'none',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.12em',
                      boxShadow: isActive ? '0 4px 20px rgba(76,175,80,0.35)' : 'none',
                    }}
                  >
                    {label}
                  </a>
                )
              })}
            </div>

            {/* Empty state */}
            {images.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '100px 24px',
              }}>
                <div style={{ fontSize: '56px', marginBottom: '20px' }}>📷</div>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '18px',
                  color: 'rgba(165,214,167,0.45)',
                }}>
                  No photos in this category yet
                </p>
              </div>
            )}

            {/* Image grid */}
            {images.length > 0 && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '64px',
                }}>
                  {images.map((image, i) => (
                    <div
                      key={image.id}
                      className="gallery-card"
                      style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid rgba(76,175,80,0.18)',
                        background: 'rgba(15,25,15,0.6)',
                        animation: `fadeInUp 0.55s ease ${Math.min(i * 0.06, 0.5)}s both`,
                      }}
                    >
                      {/* Image area */}
                      <div style={{
                        width: '100%',
                        height: '240px',
                        backgroundImage: `url(${image.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                      }}>
                        {/* Hover overlay */}
                        <div
                          className="card-overlay"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)',
                            opacity: 0,
                            transition: 'opacity 0.35s ease',
                            display: 'flex',
                            alignItems: 'flex-end',
                            padding: '16px',
                          }}
                        >
                          {image.description && (
                            <p style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '13px',
                              color: 'rgba(255,255,255,0.85)',
                              lineHeight: '1.5',
                              margin: 0,
                            }}>
                              {image.description}
                            </p>
                          )}
                        </div>

                        {/* Category pill */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          padding: '5px 14px',
                          borderRadius: '999px',
                          background: 'rgba(0,0,0,0.65)',
                          backdropFilter: 'blur(10px)',
                          fontSize: '11px',
                          color: '#4CAF50',
                          fontWeight: '700',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          border: '1px solid rgba(76,175,80,0.3)',
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}>
                          {image.category}
                        </div>
                      </div>

                      {/* Card info */}
                      <div style={{ padding: '18px 20px' }}>
                        <h3 style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '15px',
                          color: 'white',
                          fontWeight: '600',
                          marginBottom: '6px',
                          lineHeight: '1.4',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {image.title || 'Untitled'}
                        </h3>

                        {image.event && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            background: 'rgba(76,175,80,0.1)',
                            border: '1px solid rgba(76,175,80,0.2)',
                            fontSize: '12px',
                            color: 'rgba(165,214,167,0.75)',
                            fontFamily: 'Inter, sans-serif',
                          }}>
                            📅 {image.event}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                  }}>
                    {/* Prev */}
                    {safePage > 1 && (
                      <a
                        href={makeHref(activeCategory, safePage - 1)}
                        className="page-btn"
                        style={paginationLinkStyle(false)}
                      >
                        ← Prev
                      </a>
                    )}

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                      const isCurrent = pg === safePage
                      // Windowed: show first, last, current ±2
                      const show =
                        pg === 1 ||
                        pg === totalPages ||
                        Math.abs(pg - safePage) <= 2

                      if (!show) {
                        // Show ellipsis once per gap
                        if (pg === 2 || pg === totalPages - 1) {
                          return (
                            <span key={`ellipsis-${pg}`} style={{
                              padding: '10px 6px',
                              color: 'rgba(165,214,167,0.35)',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '14px',
                            }}>
                              …
                            </span>
                          )
                        }
                        return null
                      }

                      return (
                        <a
                          key={pg}
                          href={makeHref(activeCategory, pg)}
                          className="page-btn"
                          style={paginationLinkStyle(isCurrent)}
                        >
                          {pg}
                        </a>
                      )
                    })}

                    {/* Next */}
                    {safePage < totalPages && (
                      <a
                        href={makeHref(activeCategory, safePage + 1)}
                        className="page-btn"
                        style={paginationLinkStyle(false)}
                      >
                        Next →
                      </a>
                    )}
                  </div>
                )}

                {/* Page info */}
                {totalPages > 1 && (
                  <p style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(165,214,167,0.38)',
                  }}>
                    Page {safePage} of {totalPages} · {totalImages} photos
                  </p>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

function paginationLinkStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: '11px 18px',
    background: isActive
      ? 'linear-gradient(135deg, rgba(76,175,80,0.35) 0%, rgba(102,187,106,0.25) 100%)'
      : 'rgba(27,94,32,0.1)',
    border: `1px solid ${isActive ? 'rgba(76,175,80,0.55)' : 'rgba(76,175,80,0.2)'}`,
    borderRadius: '8px',
    color: isActive ? '#4CAF50' : 'rgba(165,214,167,0.6)',
    textDecoration: 'none',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: isActive ? '0 2px 12px rgba(76,175,80,0.2)' : 'none',
  }
}