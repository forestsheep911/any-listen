# Mobile web presentation

The web build uses an inclusive 767 CSS pixel breakpoint. A shared matchMedia state owns only presentation: narrow screens temporarily fill the viewport and use MiniBar; widening restores saved web window geometry and player style. Resizing does not save mobile choices into desktop preferences. The media listener is removed on release and replaced on reconnect.

The bottom navigation exposes library, search, history, extensions, and settings. Library opens the one existing Aside/MyList tree as a drawer, with close, backdrop, Escape, focus containment, and selection handling (including the currently selected list). Search explains the extension requirement when no online resource is available. The drawer footer links to the fork source.

The existing player, queue, data, login, routes, list actions, and backend remain in use. Phone rows retain the virtualizer's measured height and add explicit play/more buttons; secondary columns are hidden. Expanded playback has cover/lyrics tabs, transport, seek, and queue controls. Viewport, safe areas, modal bounds, settings wrapping, and the extension store adapt to narrow widths. Uppercase PX in mobile styles intentionally avoids the desktop postcss-pxtorem conversion for touch targets and input text.

Validation should cover 320–430 pixel portrait, short landscape, keyboard/search, empty and populated lists, drawer selection, play/seek/queue, dialogs, extensions/settings, and widening back to desktop. Static diff inspection is included in this change; production build, browser testing, and deployment verification are performed by the integrating task. Physical iPhone Safari playback remains subject to its media policies and codec support. This change does not add an iOS application or offline playback.
