'use client'

import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { Video } from '../types/video'
import { cn } from '../utils/cn'

interface VideoSelectProps {
  value: Video | null
  onChange: (video: Video | null) => void
  videos: Video[]
  className?: string
}

export default function VideoSelect({ value, onChange, videos, className }: VideoSelectProps) {
  const [query, setQuery] = useState('')

  const filteredVideos = query === ''
    ? videos
    : videos.filter((video) =>
        video.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )

  return (
    <Combobox value={value} onChange={onChange} nullable>
      {({ open }) => (
        <div className={cn('relative', className)}>
          <div className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-white text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(video: Video | null) => video?.name ?? ''}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Selecione um vídeo"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredVideos.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nenhum vídeo encontrado.
                </div>
              ) : (
                filteredVideos.map((video) => (
                  <Combobox.Option
                    key={video.id}
                    className={({ active }) =>
                      cn(
                        'relative cursor-pointer select-none py-2 pl-3 pr-9',
                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      )
                    }
                    value={video}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {video.thumbnailLink && (
                            <img
                              src={video.thumbnailLink}
                              alt=""
                              className="h-6 w-10 flex-shrink-0 rounded object-cover"
                            />
                          )}
                          <span
                            className={cn(
                              'ml-3 block truncate',
                              selected ? 'font-semibold' : 'font-normal'
                            )}
                          >
                            {video.name}
                          </span>
                        </div>

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
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      )}
    </Combobox>
  )
} 