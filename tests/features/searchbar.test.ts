import { assertEquals } from '@std/assert'
import '../init.ts'

document.body.innerHTML = `
    <main id="interface"></main>
    <dialog id="contextmenu"></dialog>
    <button id="b_interface-quotes-refresh"></button>
    <form id="sb_container">
        <input id="searchbar" />
    </form>
`

const { searchbar } = await import('../../src/scripts/features/searchbar.ts')

searchbar()

Deno.test({
    name: 'Search opens results in a new tab without an opener',
    sanitizeOps: false,
    sanitizeResources: false,
    fn: () => {
        assertEquals(submitSearch('bonjourr', true), [
            ['https://duckduckgo.com/?q=bonjourr', '_blank', 'noopener'],
        ])
    },
})

Deno.test({
    name: 'Search opens results in the current tab without new-tab features',
    sanitizeOps: false,
    sanitizeResources: false,
    fn: () => {
        assertEquals(submitSearch('bonjourr', false), [
            ['https://duckduckgo.com/?q=bonjourr', '_self'],
        ])
    },
})

Deno.test({
    name: 'Search opens bare domains in a new tab without an opener',
    sanitizeOps: false,
    sanitizeResources: false,
    fn: () => {
        assertEquals(submitSearch('example.com', true), [
            ['https://example.com', '_blank', 'noopener'],
        ])
    },
})

Deno.test({
    name: 'Search does not open a page for empty input',
    sanitizeOps: false,
    sanitizeResources: false,
    fn: () => {
        assertEquals(submitSearch('', true), [])
    },
})

/*
 * Functions
 */

function submitSearch(value: string, newtab: boolean): unknown[][] {
    const container = document.getElementById('sb_container') as HTMLFormElement
    const input = document.getElementById('searchbar') as HTMLInputElement
    const calls: unknown[][] = []
    const originalOpen = globalThis.open

    container.dataset.engine = 'ddg'
    container.dataset.newtab = newtab.toString()
    input.value = value
    globalThis.open = ((...args: unknown[]) => {
        calls.push(args)
        return null
    }) as typeof globalThis.open

    try {
        container.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    } finally {
        globalThis.open = originalOpen
    }

    return calls
}
