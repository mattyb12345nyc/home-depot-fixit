import { useState, useEffect } from 'react'
import {
  CheckCircle, Circle, Clock, Gauge, ShoppingCart, ExternalLink,
  ChevronDown, ChevronUp, Package, ArrowRight, Star, Loader2
} from 'lucide-react'
import { searchHomeDepotProducts } from '../lib/searchProducts'
import { updateProjectSteps } from '../lib/supabase'

function StepCard({ step, isOpen, onToggle, isCompleted, onComplete }) {
  const difficultyColor = {
    Easy: 'text-hd-green',
    Medium: 'text-yellow-600',
    Hard: 'text-hd-red',
  }

  return (
    <div className={`bg-white rounded-xl border transition-all ${
      isCompleted ? 'border-hd-green/30 bg-green-50/30' : 'border-hd-gray-mid'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onComplete() }}
          className="flex-shrink-0"
        >
          {isCompleted ? (
            <CheckCircle size={24} className="text-hd-green" />
          ) : (
            <Circle size={24} className="text-hd-gray-mid" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-hd-orange">STEP {step.step}</span>
            <span className="text-xs text-hd-gray-text flex items-center gap-1">
              <Clock size={10} /> {step.duration}
            </span>
          </div>
          <h3 className={`font-semibold text-sm mt-0.5 ${
            isCompleted ? 'text-hd-gray-text line-through' : 'text-hd-black'
          }`}>
            {step.title}
          </h3>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-hd-gray-text flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-hd-gray-text flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-0 ml-9 animate-fade-in">
          <p className="text-sm text-hd-dark leading-relaxed mb-2">{step.description}</p>
          <span className={`text-xs font-medium ${difficultyColor[step.difficulty]}`}>
            <Gauge size={12} className="inline mr-1" />
            {step.difficulty}
          </span>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }) {
  const href = product.link || `https://www.homedepot.com/s/${encodeURIComponent(product.name)}`
  const displayPrice = typeof product.price === 'number'
    ? `$${product.price.toFixed(2)}`
    : product.price || 'See price'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-white rounded-xl border border-hd-gray-mid p-3
                 active:bg-hd-gray transition-colors group"
    >
      <div className="w-16 h-16 rounded-lg bg-hd-gray overflow-hidden flex-shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">📦</div>'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-hd-black line-clamp-2 leading-tight">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          {product.rating && (
            <span className="flex items-center gap-0.5 text-xs text-yellow-500">
              <Star size={10} fill="currentColor" />
              {product.rating}
              {product.reviews && <span className="text-hd-gray-text">({product.reviews})</span>}
            </span>
          )}
          {product.brand && (
            <span className="text-xs text-hd-gray-text">{product.brand}</span>
          )}
        </div>
        <p className="text-hd-orange font-bold text-sm mt-1">{displayPrice}</p>
      </div>
      <ExternalLink size={16} className="text-hd-gray-text group-active:text-hd-orange flex-shrink-0" />
    </a>
  )
}

export default function RepairGuideScreen({ diagnosis, projectId, onStartOver }) {
  const [openStep, setOpenStep] = useState(0)
  const [completed, setCompleted] = useState(new Set())
  const [showProducts, setShowProducts] = useState(false)
  const [liveProducts, setLiveProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productError, setProductError] = useState(null)

  const allDone = completed.size === diagnosis.steps.length

  useEffect(() => {
    if (!diagnosis.searchQueries?.length) return

    let cancelled = false
    setLoadingProducts(true)
    setProductError(null)

    async function fetchProducts() {
      try {
        const allResults = await Promise.all(
          diagnosis.searchQueries.map((q) => searchHomeDepotProducts(q))
        )
        if (cancelled) return

        // Flatten and deduplicate by name
        const seen = new Set()
        const merged = allResults.flat().filter((p) => {
          const key = p.name?.toLowerCase()
          if (!key || seen.has(key)) return false
          seen.add(key)
          return true
        })

        setLiveProducts(merged.slice(0, 8))
      } catch (err) {
        console.error('Product search failed:', err)
        if (!cancelled) setProductError(err.message)
      } finally {
        if (!cancelled) setLoadingProducts(false)
      }
    }

    fetchProducts()
    return () => { cancelled = true }
  }, [diagnosis.searchQueries])

  const products = liveProducts.length > 0 ? liveProducts : diagnosis.products
  const totalEstimate = liveProducts.length > 0
    ? '$' + products.reduce((sum, p) => sum + (typeof p.price === 'number' ? p.price : 0), 0).toFixed(2)
    : diagnosis.totalEstimate

  function toggleComplete(stepIndex) {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(stepIndex)) {
        next.delete(stepIndex)
      } else {
        next.add(stepIndex)
      }
      // Save progress to Supabase
      if (projectId) {
        updateProjectSteps(projectId, next.size).catch(console.error)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      {/* Title bar */}
      <div className="bg-white border-b border-hd-gray-mid px-5 py-4">
        <h2 className="text-lg font-bold text-hd-black">{diagnosis.title}</h2>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-xs text-hd-gray-text flex items-center gap-1">
            <Clock size={12} className="text-hd-orange" /> {diagnosis.timeEstimate}
          </span>
          <span className="text-xs text-hd-gray-text flex items-center gap-1">
            <Gauge size={12} className="text-hd-orange" /> {diagnosis.difficultyOverall}
          </span>
          <span className="text-xs text-hd-gray-text">
            {completed.size}/{diagnosis.steps.length} steps done
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-hd-gray rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-hd-orange rounded-full transition-all duration-500"
            style={{ width: `${(completed.size / diagnosis.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-hd-gray-mid">
        <button
          onClick={() => setShowProducts(false)}
          className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors ${
            !showProducts
              ? 'border-hd-orange text-hd-orange'
              : 'border-transparent text-hd-gray-text'
          }`}
        >
          Steps ({diagnosis.steps.length})
        </button>
        <button
          onClick={() => setShowProducts(true)}
          className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            showProducts
              ? 'border-hd-orange text-hd-orange'
              : 'border-transparent text-hd-gray-text'
          }`}
        >
          <ShoppingCart size={14} />
          Products {loadingProducts ? '...' : `(${products.length})`}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-4">
        {!showProducts ? (
          <div className="space-y-3 animate-fade-in">
            {diagnosis.steps.map((step, i) => (
              <StepCard
                key={step.step}
                step={step}
                isOpen={openStep === i}
                onToggle={() => setOpenStep(openStep === i ? -1 : i)}
                isCompleted={completed.has(i)}
                onComplete={() => toggleComplete(i)}
              />
            ))}

            {allDone && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-fade-in mt-4">
                <CheckCircle size={32} className="text-hd-green mx-auto mb-2" />
                <h3 className="font-bold text-hd-green text-lg">All Done!</h3>
                <p className="text-sm text-hd-gray-text mt-1">
                  Great job fixing your {diagnosis.title.toLowerCase()}. You saved on a pro visit!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Total */}
            <div className="bg-hd-orange/5 border border-hd-orange/20 rounded-xl p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-hd-gray-text uppercase tracking-wider font-medium">Estimated Total</p>
                <p className="text-2xl font-bold text-hd-orange">{totalEstimate}</p>
              </div>
              <Package size={28} className="text-hd-orange/40" />
            </div>

            {liveProducts.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-hd-green" />
                <span className="text-xs text-hd-green font-medium">Live from HomeDepot.com</span>
              </div>
            )}

            {loadingProducts ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 size={32} className="text-hd-orange animate-spin mb-3" />
                <p className="text-sm text-hd-gray-text">Searching HomeDepot.com...</p>
              </div>
            ) : productError ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-hd-red font-medium">Couldn't load live products</p>
                <p className="text-xs text-hd-gray-text mt-1">Showing recommended products instead</p>
              </div>
            ) : null}

            {/* Products list */}
            {!loadingProducts && (
              <div className="space-y-3">
                {products.map((product, i) => (
                  <ProductCard key={product.sku || product.name || i} product={product} />
                ))}
              </div>
            )}

            {/* Shop CTA */}
            {!loadingProducts && products.length > 0 && (
              <>
                <a
                  href={`https://www.homedepot.com/s/${encodeURIComponent(diagnosis.title + ' repair')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-hd-orange text-white font-bold
                             py-4 rounded-xl mt-6 active:bg-hd-orange-dark transition-colors
                             shadow-lg shadow-hd-orange/25"
                >
                  <ShoppingCart size={20} />
                  Shop All on HomeDepot.com
                  <ArrowRight size={18} />
                </a>

                <p className="text-center text-xs text-hd-gray-text mt-3">
                  Tap each product above to add individually to your cart on homedepot.com
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-5 pb-6 pt-2">
        <button
          onClick={onStartOver}
          className="w-full bg-hd-black text-white font-medium py-3 rounded-xl
                     active:bg-hd-dark transition-colors"
        >
          Scan Another Problem
        </button>
      </div>
    </div>
  )
}
