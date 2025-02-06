import React from 'react'

const Title = ({ text1, text2 }) => { //This component takes in two texts and renders them with styling, it displays the first text in a lighter gray with a bold span for the second one along with a decorative line on the side.
  return ( //The container uses inline-flex to display items horizontally with a gap between them and align items vertically centered and adds a bottom margin.
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-gray-500 font-bold'>
        {text1} <span className='text-gray-700'>{text2}</span>
      </p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
    </div>
  )
}

export default Title
