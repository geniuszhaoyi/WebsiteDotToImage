import Entry from './entry'

function Entries({ entries }) {
  if (entries && entries.map) {
    return (
      <div>
        {entries.map((e) => (
          <div key={e.id} className="py-2">
            <Entry id={e.id} title={e.title} content={e.content} />
          </div>
        ))}
      </div>
    )
  } else {
    return null
  }
}

export default Entries
