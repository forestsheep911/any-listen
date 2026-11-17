# Casual listening

The 随便听 card on Search and Library prepares a batch of up to 12 popular Chinese songs without requiring an existing collection. The catalog contains 100 song/artist pairs grouped across the 1980s, 1990s, 2000s, 2010s and 2020s. Each shuffled five-seed round samples all five eras. This is curated discovery, not a personalized recommender.

The resolver searches installed NetEase and JOOX sources sequentially. It requires an exact normalized title and original artist, rejects named live/remix/cover/instrumental versions, respects the dislike list, and asks the existing player URL service for a playable URL. URL resolution is a preflight, not a guarantee that the media server will serve audio. The ordinary player keeps its retries and advances past failed radio tracks.

One batch examines at most 24 seeds and two providers. Search and URL requests share a 9-second gate. Its timestamp survives page reloads in localStorage; supporting browsers also serialize the gate across tabs with Web Locks. This leaves headroom below GD's observed 50 requests per five minutes for player artwork and lyrics. A rate-limit or URL timeout error stops preparation instead of triggering immediate retries. Ordinary manual search is outside this feature's gate.

The first resolved track starts playback. Later resolved tracks append to the same real general playlist through the existing linked-list synchronization. The generated list is identified by its description marker, not its visible name. A new successful batch atomically replaces only that generated list; zero results leave the existing playback queue unchanged. Favorites use the existing heart and love list. The radio sets list-loop mode like Play all and does not change the user's global auto-skip preference.

Preparation continues across route navigation. Stop preparation cancels future work after the current extension request settles and leaves already playing music intact. Starting another track/list or disconnecting cancels the batch. An outstanding request is not replaced by a concurrent retry. The UI offers a manual play fallback for browser autoplay restrictions.

Run matching and era coverage checks with `node --test packages/view-main/src/modules/casualRadio/catalog.test.mjs`. Production builds and live browser playback are verified by the integrating task.
