Bookmaster3000 - Frontend

# Процесс работы с задачами

1) Все технические задания хранятся во вкладке `Issues` текущего репозитория
2) Задания делятся на 4 типа.

**Task** - разработка нового функционала, помечается тегом `Task`

**Bug** - ошибка найденная тестировщиком, помечается тегом `Bug`

**Analysis** - задача на анализ/разработка, которая находится в процессе постановки, брать нельзя. Выполняет аналитик. Тег `Analysis`

**Documentation** - задача на актуализацию документации, выполняет техписатель. Тег `Documentation`.

---

Тег `Backlog` означает, что задача готова к разработке. Разработчики имеют право брать только такие задачи
При выполнении задачи разработчик прописывает `Assignee`-себя

Актуальные задачи на разработку закрепляются в `Issue`

Всё влитие в код делаются через `pull requests` и этот request необходимо прикрепить к **Декомпозированной задаче**. При влитии задача будет автоматически закрыта `GitHub`

## Декомпозиция задач

Основная задача на разработку помечаются нумерацией `(#1, #2, #3)` и префиксом `[Разработка]`. Пример: `[Разработка]: #1 Выстрелить в потолок`
К задаче на разработку может существовать задача на анализ, которая нумеруется **РОВНО** как задача на разработку (а если быть точнее то разработка равняется на номер анализа) `(#1, #2, #3)` и префиксом `[Анализ]`. Пример: `[Анализ]: #1 Выстрелить в ногу`

Аналитик прописывает основную задачу на разработку. Разработчики могут разделять одну задачу на несколько. В таком случае разработчик создаёт новую задачу на себя с названиями подобными шаблонам
1) `[Разработка.Декомпозиция] Родитель #1. #1 Реализовать компоненты Icon, SlideToggle, DropdownMenu`
2) `[Разработка.Декомпозиция] Родитель #1. #2 Реализовать компоненты Checkbox, Radio, Input, Select`
3) `[Разработка.Декомпозиция] Родитель #1. #3 Покурить трубку`

Так мы сможем в конечном итоге видеть кто и что делал

# Процесс тестирования
