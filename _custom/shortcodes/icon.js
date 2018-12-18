module.exports = function(iconName) {
    const spriteUrl = '/assets/icons/icons.sprite.svg'
    return `<svg class="icon icon--${iconName}" role="img" aria-hidden="true" width="24" height="24">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${spriteUrl}#icon-${iconName}"></use>
            </svg>`
}
