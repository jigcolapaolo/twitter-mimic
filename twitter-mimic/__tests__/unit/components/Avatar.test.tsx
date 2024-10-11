import { render, screen } from "@testing-library/react";
import { Avatar } from "@/ui/components/Avatar";

describe('Avatar component', () => {
    it('should render an image with the correct src, alt, width and height', () => {
        render(<Avatar src="/avatar.png" alt="User avatar" width={150} height={150}/>)

        const image = screen.getByRole('img', { name: 'User avatar' })
        expect(image).toHaveAttribute('src', '/avatar.png')
        expect(image).toHaveAttribute('alt', 'User avatar')
        expect(image).toHaveAttribute('width', '150')
        expect(image).toHaveAttribute('height', '150')
    })

    it('should render with default width and height if not provided', () => {
        render(<Avatar src="/avatar.png" alt="Default avatar"/>)

        const image = screen.getByRole('img', { name: 'Default avatar' })
        expect(image).toHaveAttribute('width', '100')
        expect(image).toHaveAttribute('height', '100')
    })

    it('should render text if provided', () => {
        render(<Avatar src="/avatar.png" alt="Avatar" text="Jay"/>)

        const textElement = screen.getByText('Jay')
        expect(textElement).toBeInTheDocument()
    })
})