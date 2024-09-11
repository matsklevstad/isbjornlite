import {IconCircleArrowDownFilled} from '@tabler/icons-react';

const ScrollDownBtn = () => {

    const handleScroll = () => {
        const nextSection = document.getElementById('scrolltarget');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('No next section found');
        }
    };

    return (
        <div className="flex w-full h-full absolute justify-center items-end p-10 z-10">
            <button onClick={handleScroll}>
                <IconCircleArrowDownFilled size={35} color="#ffffff"/>
            </button>
        </div>
    );
};

export default ScrollDownBtn;