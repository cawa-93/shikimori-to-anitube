// ==UserScript==
// @name         From Shikimori to AniTube.in.ua
// @name:uk      З Shikimori до AniTube.in.ua
// @namespace    shikimori
// @version      0.2
// @description  Paste quick shortcut from Shikimori to AniTube.in.ua
// @description:uk  Вставляє пряме посилання з Shikimori на AniTube.in.ua
// @author       Alex Kozack
// @match        https://shikimori.one/animes/*
// @icon         <$ICON$>
// @grant         GM.xmlHttpRequest
// @run-at document-end
// @connect anitube.in.ua
// ==/UserScript==

(function () {
    'use strict';

    /**
     * @return {string}
     */
    function getAnimeTitle() {
        const [ru, eng] = document.querySelector('h1').textContent.split('/')
        return eng || ru
    }

    /**
     * @param {HTMLElement} el
     * @returns {{title: string, url: string, description: string}}
     */
    function parseSingleResult(el) {
        const title = el.querySelector('h2').textContent.trim()
        const url = el.querySelector('h2 a').href
        const description = el.querySelector('.story_link').textContent
        return {
            title: title,
            url: url,
            description: description,
        }
    }

    /**
     *
     * @param {string} html
     * @return {{description: string, title: string, url: string}[]}
     */
    function parseSearchResult(html) {
        const template = document.createElement('template')
        template.innerHTML = html
        console.log(template)
        return Array.from(template.content.querySelectorAll('#dle-content article')).map(parseSingleResult)
    }

    /**
     *
     * @return {string}
     */
    function getSearchUrl() {
        return 'https://anitube.in.ua/index.php?do=search&subaction=search&from_page=0&story=' + getAnimeTitle()
    }

    /**
     *
     * @param {{description: string, title: string, url: string}[]} results
     */
    function createSearchResultBox(results) {
        const html = results.length
            ? results.map(function (result) {
                return '<p style="line-height: 1.2;margin-bottom: 1em;"><a class="watch-link" href="' + result.url + '">' + result.title + '</a><br><small>' + result.description + '</small></p>'
            }).join('')
            : 'Нічого не знайдено 🤷‍'
        document.querySelector('.c-info-right').insertAdjacentHTML('beforeend', '<div class="block" style="margin-top: 30px;"><div class="subheadline"><a href="' + getSearchUrl() + '">AniTube.in.ua</a></div><div class="block">' + html + '</div></div>')
    }


    GM.xmlHttpRequest({
        method: 'GET',
        url: getSearchUrl(),
        fetch: true,
        onload: function (r) {
            createSearchResultBox(
                parseSearchResult(r.response)
            )
        }
    })

})();
