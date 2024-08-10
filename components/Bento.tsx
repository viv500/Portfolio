import React from 'react'
import { BentoGridItem, BentoGrid } from './ui/bento-grid'
import { BentoItems } from './data/index'

const Bento = () => {
    return (
        <section id="about">
            <BentoGrid>
                {BentoItems.map((item, index) => (
                    <BentoGridItem
                        id={item.id}
                        key={index}
                        title={item.title}
                        description={item.description}
                        img={item.img}
                        className={item.className}
                    />
                ))
                }

            </BentoGrid>

        </section>
    )
}

export default Bento
