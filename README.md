# celestial-dragon-tavern
Welcome to Tavern "Celestial Dragon" - an interactive Dungeons &amp; Dragons (D&amp;D)-style web platform that allows you to create a unique atmosphere using real-time control of music, sound, and visual effects.

The Celestial Dragon is a cosmic being that can control the elements and create magical effects.




Thanks 
Music by <a href="https://pixabay.com/users/tim_kulig_free_music-31678821/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=127812">Timothy Kulig</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=127812">Pixabay</a>

Music by <a href="https://pixabay.com/users/paulyudin-27739282/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=198537">Pavel Bekirov</a> from <a href="https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=198537">Pixabay</a>

Music by <a href="https://pixabay.com/users/composiia-38203768/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=173739">Tell Costa</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=173739">Pixabay</a>






Logic and architecture
Модульность и поддерживаемость:
Разделение кода на отдельные компоненты повышает модульность приложения. Это упрощает поддержку и развитие кода, позволяет повторно использовать компоненты в разных частях приложения.

Разделение ответственности:
Каждый компонент отвечает за свою конкретную функциональность. Это соответствует принципам SOLID и лучшим практикам разработки.




Производительность:
Использование <canvas> для анимации большого количества объектов (например, капель дождя) более эффективно, чем манипуляции с DOM-элементами. <canvas> позволяет рисовать графику напрямую, что снижает нагрузку на браузер и улучшает производительность.

Гладкость анимации:
Анимации на <canvas> часто выглядят более плавно, особенно при большом количестве объектов.