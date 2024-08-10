import React from 'react'
import { BentoGridItem, BentoGrid } from './ui/bento-grid'

const Bento = () => {
    return (
        <section id="about">
            <BentoGrid>
                {[{ title: 'title1', description: 'disc1', id: 1 },
                { title: 'title1', description: 'disc1', id: 1 },
                { title: 'title1', description: 'disc1', id: 1 },
                { title: 'title1', description: 'disc1', id: 1 }].map
                    ((item, index) => (
                        <BentoGridItem
                            id={item.id}
                            key={item.id}
                            title={item.title}
                            description={item.description}
                        />
                    ))}

            </BentoGrid>

        </section>
    )
}

export default Bento
