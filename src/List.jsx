export default function ListSection({ title, items }) {
  return (
    <div className="mt-6">

      <h3 className="font-semibold text-gray-900">
        {title}
      </h3>

      <ul className="mt-2 list-disc space-y-2 pl-5 text-gray-600">

        {items.map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}

      </ul>

    </div>
  );
}