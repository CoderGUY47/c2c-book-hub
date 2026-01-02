import { Button } from '@/components/ui/button';
import { TbShare2 } from 'react-icons/tb';
import {RWebShare} from 'react-web-share'


interface RWebShareProps{
    url: string;
    title: string;
    text: string;
}

export const ShareButton :React.FC<RWebShareProps> = ({url,title,text}) => {
    return(
        <RWebShare
        data={{
            text:text,
            title:title,
            url:url
        }}
        onClick={() => console.log("Shared successfully clicked")}
        >
            <Button variant='outline' className='cursor-pointer'>
                <TbShare2 className="size-5 mr-1" />Share
            </Button>
        </RWebShare>
    
    )
} 