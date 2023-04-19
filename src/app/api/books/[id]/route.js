import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
    try {    
        const id = params.id;
        const book = await prisma.book.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                year: true,
                author: true,
                pageCount: true,
                readPage: true,
                finished: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!book) {
            return NextResponse.json({
                status: "fail",
                message: "Buku tidak ditemukan",
            }, {
                status: 404,
            });
        }

        return NextResponse.json({
            status: "success",
            data: {
                book
            }
        }, {
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            status: "fail",
            message: "Gagal mengambil data"
        }, {
            status: 500
        })
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params
        const {readPage} = await request.json()

        if (!readPage) {
            return NextResponse.json({
                status: "fail",
                message: "Gagal memperbarui buku. Mohon lengkapi data"
            }, {
                status: 400
            })
        }

        const book = await prisma.book.findUnique({
            where: { id },
        });

        if (!book) {
            return NextResponse.json({
                status: "fail",
                message: "Gagal memperbarui buku. Id tidak ditemukan"
            }, {
                status: 404
            })    
        }
        
        const { pageCount } = book;
        
        if (readPage > pageCount) {
            return NextResponse.json({
                status: "fail",
                message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
            }, {
                status:400
            })
        }

        await prisma.book.update({
            where: { id },
            data: {
                readPage: readPage,
                finished: readPage === pageCount,
            },
        });

        const updatedBook = await prisma.book.findUnique({
            where: { id },
            select: {
                readPage: true,
                finished: true
            },
        });

        return NextResponse.json({
            status: "success",
            message: "Buku berhasil diperbarui",
            data: {
                book: updatedBook
            }
        }, {
            status:200
        })
    } catch (error) {
        return NextResponse.json({
          status: "fail",
          message: "Gagal memperbarui data"
        }, {
          status: 500
        })
    }
}

export async function DELETE(request, {params}) {
    try {
        const { id } = params
        const book = await prisma.book.findUnique({
            where: {
                id: id
            }
        });
        
        if (!book) {
        return NextResponse.json({
            status: "fail",
            message: 'Gagal menghapus buku. Id tidak ditemukan'
        }, {
            status: 404
        })
        }

        await prisma.book.delete({ 
            where: {
                id
            }
        });

        return NextResponse.json({
            status: "success",
            message: 'Buku berhasil dihapus'
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
          status: "fail",
          message: "Gagal menghapus data"
        }, {
          status: 500
        })
      }
    }