import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BusinessOnboardingTitle from './BusinessOnboardingTitle'
import { createBusinessListingDraft, getBusinessListingDraft, updateBusinessListingDraft } from './business-api'

export default function BusinessBasicStep() {
  const navigate = useNavigate()
  const [draftId, setDraftId] = useState<string>(() => localStorage.getItem('business_listing_draft_id') || '')
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category_id: '',
    summary: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!draftId) return
    setLoading(true)
    getBusinessListingDraft(draftId)
      .then((data) => {
        setForm({
          name: data.name || '',
          slug: data.slug || '',
          category_id: data.category_id || '',
          summary: data.summary || '',
          description: data.description || '',
        })
      })
      .catch(() => {
        localStorage.removeItem('business_listing_draft_id')
        setDraftId('')
      })
      .finally(() => setLoading(false))
  }, [draftId])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const generateDraftId = () => `listing_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`

  const saveDraft = async (payload: Partial<typeof form>) => {
    setError(null)
    setLoading(true)
    try {
      if (!draftId) {
        const newId = generateDraftId()
        await createBusinessListingDraft({
          id: newId,
          name: payload.name || form.name,
          slug: payload.slug || form.slug,
          category_id: payload.category_id || form.category_id,
          summary: payload.summary ?? form.summary,
          description: payload.description ?? form.description,
          status: 'draft',
        })
        localStorage.setItem('business_listing_draft_id', newId)
        setDraftId(newId)
        return newId
      }
      await updateBusinessListingDraft(draftId, payload)
      return draftId
    } catch (err) {
      setError('Unable to save your draft. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const id = await saveDraft(form)
      navigate(`/business/onboarding/category?draftId=${id}`)
    } catch {
      /* handled above */}
  }

  return (
    <div className="space-y-6">
      <BusinessOnboardingTitle title="Basic information" description="Start with your business listing title, slug, and category." />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Business name</span>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded-3xl border p-3" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Slug</span>
            <input name="slug" value={form.slug} onChange={handleChange} required className="w-full rounded-3xl border p-3" />
          </label>
        </div>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Category ID</span>
          <input name="category_id" value={form.category_id} onChange={handleChange} required className="w-full rounded-3xl border p-3" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Summary</span>
          <textarea name="summary" value={form.summary} onChange={handleChange} rows={3} className="w-full rounded-3xl border p-3" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="w-full rounded-3xl border p-3" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="inline-flex items-center rounded-3xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 disabled:opacity-60">
            Save and continue
          </button>
          <button type="button" disabled={loading} onClick={() => saveDraft(form)} className="inline-flex items-center rounded-3xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100 disabled:opacity-60">
            Save progress
          </button>
        </div>
      </form>
    </div>
  )
}
