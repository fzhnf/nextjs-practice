import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try{
    const { searchParams } = new URL(request.url)
    const author = searchParams.get('author')
    let books

    if (author) {
      books = await prisma.book.findMany({
        where: {
          author: {
            contains: author
          }
        }
      })
    } else {
      books = await prisma.book.findMany();
    }

    return NextResponse.json(
      {
        status: "success",
        data: {
          books: books,
        },
      },
      {
        status: 200,
      }
    )
    } catch (error) {
      return NextResponse.json({
        status: "fail",
        message: "Gagal mengambil data"
      }, {
        status: 500
      })
    }
}

export async function POST(request) {
  try {
    const { name, year, author, readPage, pageCount } = await request.json()
    if (!name || !year || !author || !readPage || !pageCount) {
      return NextResponse.json({
        status: "fail",
        message: "Gagal menambah buku. Mohon lengkapi data",
      }, {
        status: 400
      })
    }
  
    if (readPage > pageCount) {
      return NextResponse.json({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      }, {
        status: 400
      })
    }
  
    const book = await prisma.book.create({
      data: {
        name,
        year,
        author,
        readPage,
        pageCount,
        finished: readPage === pageCount,
      },
      select: {
        id: true,
      },
    });
  
    return NextResponse.json({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: book
    }, {
      status: 201
    })
  } 
  catch (error) {
    return NextResponse.json({
      status: "fail",
      message: "gagal menambahkan data"
    }, {
      status: 500
    })
  }
}