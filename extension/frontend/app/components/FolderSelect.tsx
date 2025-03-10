'use client'

import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { cn } from '../utils/cn'

interface FolderSelectProps {
  value: string | null
  onChange: (value: string | null) => void
  folders: string[]
  className?: string
}

export default function FolderSelect({ value, onChange, folders, className }: FolderSelectProps) {
  const uniqueFolders = ['Raiz', ...new Set(folders.filter(Boolean))]

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className={cn('relative', className)}>
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
            <span className="block truncate">
              {value === null ? 'Raiz' : value}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {uniqueFolders.map((folder) => (
                <Listbox.Option
                  key={folder}
                  className={({ active }) =>
                    cn(
                      'relative cursor-pointer select-none py-2 pl-3 pr-9',
                      active ? 'bg-blue-600 text-white' : 'text-gray-900'
                    )
                  }
                  value={folder === 'Raiz' ? null : folder}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={cn(
                          'block truncate',
                          selected ? 'font-semibold' : 'font-normal'
                        )}
                      >
                        {folder}
                      </span>

                      {selected ? (
                        <span
                          className={cn(
                            'absolute inset-y-0 right-0 flex items-center pr-4',
                            active ? 'text-white' : 'text-blue-600'
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
} 